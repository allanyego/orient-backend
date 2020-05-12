const db = require('../db');
const policyCtrl = require('./policies');
const lowerCase = require('./helpers/lowerCase');

async function find({
  search, limit
}) {
  try {
    let q = 'SELECT * FROM clients';
    const values = [];
    if (search) {
      q += ` WHERE (first_name LIKE '%${search}%') OR
        (middle_name LIKE '%${search}%') OR (last_name LIKE '%${search}%')`;
    }
    if (limit) {
      q += ` LIMIT $1`;
      values.push(limit);
    }

    const { rows } = await db.query(q, values);
    return rows;
  } catch (error) {
    throw error;
  }
}

async function create({
  firstName,
  lastName,
  middleName,
  idNumber,
  kraPin,
  phoneNumber,
  addressNumber,
  addressCode,
  addressTown,
  occupation,
  policy,
  insurer,
  email
}) {
  try {
    const q = `INSERT INTO clients(first_name, last_name, middle_name, id_number,
      phone_number, kra_pin, address_number, address_code, address_town, occupation,
      email) 
      VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING id`;
    const values = [firstName, lastName, (middleName || null), idNumber, phoneNumber,
      kraPin, addressNumber, addressCode, addressTown, occupation, email];
    const { rows: [row] } = await db.query(q, lowerCase(values));

    const newPolicy = await policyCtrl.create({
      insurer,
      client: row.id,
      ...policy,
    });

    const newClient = await findById(row.id);

    return { ...newClient, policy: newPolicy };
  } catch (error) {
    throw error;
  }
}

async function findOne({ idNumber, kraPin }) {
  try {
    const values = [];
    let q = `SELECT * FROM clients `;
    if (idNumber) {
      q += `WHERE(id_number=$1) `;
      values.push(idNumber);
    }
    if (kraPin) {
      q += `${values.length ? 'or' : 'WHERE'} 
        (kra_pin=$${values.length + 1}) `;
      values.push(kraPin);
    }
    q += `LIMIT 1`;
    
    const { rows: [row] } = await db.query(q, values);
    if (!row) {
      return null;
    }

    return row;
  } catch (error) {
    throw error;
  }
}

async function findById(id) {
  try {
    const q = `SELECT * FROM clients WHERE (id=$1) LIMIT 1`;
    const values = [id];
    const { rows: [row] } = await db.query(q, values);
    if (!row) {
      return null;
    }

    return row;
  } catch (error) {
    throw error;
  }
}

module.exports = {
  create,
  find,
  findOne,
  findById,
}