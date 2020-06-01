const db = require("../db");
const vehicleCtrl = require("./vehicles");
const lowerCase = require("./helpers/lowerCase");

async function createFirePolicy({
  policyNumber,
  policyPeriod,
  sumInsured,
  premiumRate,
  pvt,
  insurer,
  client,
  policyClass,
}) {
  let startDate = policyPeriod.start;
  let endDate = new Date(startDate);
  endDate.setFullYear(endDate.getFullYear() + 1);

  const q = `INSERT INTO policies(
    policy_number,
    policy_period_start,
    policy_period_end,
    sum_insured,
    premium_rate, 
    pvt,
    insurer,
    client,
    policy_class) 
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id`;
  const values = [
    policyNumber,
    startDate,
    endDate,
    sumInsured,
    premiumRate,
    pvt,
    insurer,
    client,
    policyClass,
  ];

  const {
    rows: [row],
  } = await db.query(q, lowerCase(values));

  return {
    ...(await findById(row.id)),
  };
}

async function create({
  policyNumber,
  policyPeriod,
  sumInsured,
  premiumRate,
  pvt,
  excessProtection = false,
  antiTheftCoverage = false,
  passengersPllCoverage = false,
  rookie = false,
  insurer,
  client,
  vehicle,
  policyClass,
}) {
  if (policyClass === "fire") {
    return await createFirePolicy({
      policyNumber,
      policyPeriod,
      sumInsured,
      premiumRate,
      pvt,
      insurer,
      client,
      policyClass,
    });
  }

  let startDate = policyPeriod.start;
  let endDate = new Date(startDate);
  endDate.setFullYear(endDate.getFullYear() + 1);

  try {
    const q = `INSERT INTO policies(
        policy_number,
        policy_period_start,
        policy_period_end,
        sum_insured,
        premium_rate,
        pvt,
        excess_protection,
        anti_theft_coverage,
        passengers_pll_coverage,
        rookie,
        insurer,
        client,
        policy_class) VALUES
        ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) RETURNING id`;
    const values = [
      policyNumber,
      startDate,
      endDate,
      sumInsured,
      premiumRate,
      pvt,
      excessProtection,
      antiTheftCoverage,
      passengersPllCoverage,
      rookie,
      insurer,
      client,
      policyClass,
    ];

    const {
      rows: [row],
    } = await db.query(q, lowerCase(values));

    return {
      ...(await findById(row.id)),
      vehicle: await vehicleCtrl.create({ ...vehicle, policy: row.id }),
    };
  } catch (error) {
    throw error;
  }
}

async function findById(id) {
  try {
    const q = `SELECT * FROM policies WHERE (id=$1) LIMIT 1`;
    const values = [id];
    const {
      rows: [row],
    } = await db.query(q, values);
    if (!row) {
      return null;
    }

    return row;
  } catch (error) {
    throw error;
  }
}

async function findOne({ number }) {
  try {
    const q = `SELECT * FROM policies WHERE (policy_number=$1)`;
    const values = [number];
    const {
      rows: [row],
    } = await db.query(q, values);
    if (!row) {
      return null;
    }

    return row;
  } catch (error) {
    throw error;
  }
}

async function find({ client, insurer, search, limit, type }) {
  try {
    let q = `SELECT * FROM policies`;
    const values = [];
    if (client && insurer) {
      q += ` WHERE (client=$1) and (insurer=$2)`;
      values.push(client, insurer);
    } else if (client) {
      q += ` WHERE (client=$1)`;
      values.push(client);
    } else if (insurer) {
      q += ` WHERE (insurer=$1)`;
      values.push(insurer);
    } else if (search) {
      q += ` WHERE (policy_number LIKE '%${search}%')`;
    }

    if (type) {
      q += ` ${values.length ? "and" : "WHERE"} (type=$${values.length + 1})`;
      values.push(type);
    }

    if (limit) {
      q += ` LIMIT $${values.length + 1}`;
      values.push(limit);
    }

    const { rows } = await db.query(q, values);

    return rows;
  } catch (error) {
    throw error;
  }
}

async function edit({ id, approved = true }) {
  try {
    const q = `UPDATE policies SET approved=$1, date_approved=CURRENT_TIMESTAMP
      WHERE (id=$2) RETURNING id`;
    const values = [approved, id];
    const {
      rows: [row],
    } = await db.query(q, values);

    return await findById(row.id);
  } catch (error) {
    throw error;
  }
}

async function renew({ id }) {
  const q = `UPDATE policies SET approved=false, policy_period_start=$1,
    policy_period_end=$2, date_approved=NULL, type=$3 WHERE id=$4
    RETURNING id`;

  const start = new Date();
  const end = new Date();
  end.setFullYear(start.getFullYear() + 1);
  const values = [start, end, "renewal", id];

  const {
    rows: [row],
  } = await db.query(q, values);
  return await findById(row.id);
}

async function getExpired() {
  // Get policies that expired within the last day
  const q = `SELECT policy_number, policy_period_start, policy_period_end,
    c.first_name, c.email FROM policies p JOIN clients c ON (p.client=c.id)
    WHERE p.policy_period_end > now() - interval '1 day'`;

  const { rows } = await db.query(q);
  return rows;
}

module.exports = {
  edit,
  find,
  findOne,
  findById,
  create,
  renew,
  getExpired,
};