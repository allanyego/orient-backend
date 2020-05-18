const db = require('../db');
const lowerCase = require('./helpers/lowerCase');
const sign = require('./helpers/sign');
const bcrypt = require('bcrypt');

async function findOne({
  email,
  idNumber,
  phoneNumber
}) {
  let q = `SELECT id, first_name, middle_name, last_name, email
      FROM admins`;
  const values = [];
  if (email) {
    q += ` WHERE (email=$${values.length + 1})`;
    values.push(email);
  }
  if (idNumber) {
    q += ` ${values.length ? 'or' : 'WHERE'}
      (id_number=$${values.length + 1})`;
    values.push(idNumber);
  }
  if (phoneNumber) {
    q += ` ${values.length ? 'or' : 'WHERE'}
      (phone_number=$${values.length + 1})`;
    values.push(phoneNumber);
  }
  q += ` LIMIT 1`;

  const { rows: [row] } = await db.query(q, lowerCase(values));
  if (!row) {
    return null;
  }

  return row;
}

async function create({
  firstName,
  lastName,
  middleName,
  email,
  idNumber,
  addressNumber,
  addressCode,
  addressTown,
  phoneNumber,
}) {
  try {
    const q = `INSERT INTO admins (first_name, middle_name, last_name,
      email, id_number, address_number, address_code, address_town,
      phone_number) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id`;
    const values = [firstName, middleName, lastName, email, idNumber,
      addressNumber, addressCode, addressTown, phoneNumber];

    const { rows: [row] } = await db.query(q, lowerCase(values));

    return await findById(row.id);
  } catch (error) {
    throw error;
  }
}

async function findById(id) {
  try {
    const q = `SELECT id, first_name, middle_name, last_name, email
      FROM admins WHERE (id=$1) LIMIT 1`;
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

async function isAdminPassword({
  adminId,
  password
}) {
  const q = 'SELECT password from admins where id=$1 LIMIT 1';
  const values = [adminId];

  const { rows: [row] } = await db.query(q, values);
  if (row.password === 'password' && password === 'password') {
    return true;
  }

  const valid = await bcrypt.compare(row.password, password);
  return Boolean(valid);
}

async function editPassword({
  adminId,
  newPassword
}) {
  newPassword = await bcrypt.hash(newPassword, 1);
  const q = 'UPDATE admins SET password=$1 WHERE id=$2 returning id';
  const values = [newPassword, adminId];

  const { rows: [row] } = await db.query(q, values);
  if (!row) {
    return null;
  };
  return row.id;
}

async function authenticate({
  email,
  password
}) {
  const q = 'SELECT id, password from admins where email=$1 LIMIT 1';
  const values = [email];

  const { rows: [row] } = await db.query(q, lowerCase(values));
  if (row.password === 'password' && password === 'password') {
    return {
      id: row.id,
      accState: 'NEEDS_RESET'
    }
  }

  const valid = await bcrypt.compare(password, row.password);

  if (valid) {
    const user = await findById(row.id);
    return {
      token: sign(user),
      ...user
    }
  }

  return null;
}

module.exports = {
  create,
  findOne,
  findById,
  isAdminPassword,
  editPassword,
  authenticate
};
