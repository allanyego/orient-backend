const db = require('../db');
const lowerCase = require('./helpers/lowerCase');

async function create({
  registrationNumber,
  make,
  bodyType,
  bodyColor,
  manufactureYear,
  chasisNumber,
  engineNumber,
  ratingCc,
  tonnage,
  policy,
}) {
  try {
    const q = `INSERT INTO vehicles(registration_number, make, body_type, 
      manufacture_year, chasis_number, engine_number, rating_cc, tonnage,
      policy, body_color) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING id`;
    const values = [registrationNumber, make, bodyType, manufactureYear,
      chasisNumber, engineNumber, ratingCc, tonnage, policy, bodyColor];

    const { rows: [row] } = await db.query(q, lowerCase(values));

    return await findById(row.id);
  } catch (error) {
    throw error;
  }
}

async function findById(id) {
  try {
    const q = `SELECT * FROM vehicles WHERE (id=$1) LIMIT 1`;
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

async function findByPolicy({
  policy
}) {
  const q = `SELECT * FROM vehicles WHERE (policy=$1) LIMIT 1`;
  const values = [policy];

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

async function findOne({
  registrationNumber,
  chasisNumber,
  engineNumber,
}) {
  try {
    const values = [];
    let q = `SELECT * FROM vehicles `;
    if (registrationNumber) {
      q += `WHERE(registration_number=$1) `;
      values.push(registrationNumber);
    }
    if (chasisNumber) {
      q += `${values.length ? 'or' : 'WHERE'} 
        (chasis_number=$${values.length + 1}) `;
      values.push(chasisNumber);
    }
    if (engineNumber) {
      q += `${values.length ? 'or' : 'WHERE'} 
        (engine_number=$${values.length + 1}) `;
      values.push(engineNumber);
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

module.exports = {
  findOne,
  findById,
  create,
  findByPolicy
}