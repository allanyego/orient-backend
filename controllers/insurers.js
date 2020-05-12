const db = require('../db');
const lowerCase = require('./helpers/lowerCase');

// Select all insurers
async function find({
  search, limit
}) {
  try {
    let q = "SELECT * FROM insurers";
    const values = [];
    if (search) {
      q += ` WHERE (name LIKE ('%${search}%'))`;
    }
    if (limit) {
      q += ` LIMIT $1`;
      values.push(limit);
    }

    const { rows } = await db.query(q, values);
    return rows;
  } catch (error) {
    throw error
  }
}

async function create({
  name,
  addressNumber,
  addressCode,
  addressTown,
  phoneNumber
}) {
  try {
    const q = `INSERT INTO insurers (name, address_number, address_code,
      address_town, phone_number) VALUES($1, $2, $3, $4, $5) RETURNING id`;
    const values = [name, addressNumber, addressCode, addressTown, phoneNumber];
    const { rows: [row] } = await db.query(q, lowerCase(values));

    return await findById(row.id);
  } catch (error) {
    throw error;
  }
}

async function findOne({
  addressNumber,
  addressCode,
  addressTown,
  phoneNumber
}) {
  const values = [];
  let q = `SELECT * FROM insurers `;
  if (phoneNumber) {
    q += `WHERE(phone_number=$1) `;
    values.push(phoneNumber);
  }
  if (addressCode) {
    q += `${values.length ? 'and' : 'WHERE'} 
        (address_code=$${values.length + 1}) `;
    values.push(addressCode);
  }
  if (addressNumber) {
    q += `${values.length ? 'and' : 'WHERE'} 
        (address_number=$${values.length + 1}) `;
    values.push(addressNumber);
  }
  if (addressTown) {
    q += `${values.length ? 'and' : 'WHERE'} 
        (address_town=$${values.length + 1}) `;
    values.push(addressTown);
  }
  q += `LIMIT 1`;
  try {
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
    const q = `SELECT * FROM insurers WHERE (id=$1) LIMIT 1`;
    values = [id];
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
  find,
  create,
  findOne,
  findById,
};
