require('dotenv').config();
const pg = require('pg');
require('pg-camelcase').inject(pg);

let pool;
const { NODE_ENV, PROD_DATABASE_URL } = process.env;
if (NODE_ENV === 'production' && PROD_DATABASE_URL) {
  pool = new pg.Pool({
    connectionString: PROD_DATABASE_URL,
    ssl: true,
  });
} else {
  pool = new pg.Pool();
}

module.exports = {
  query: (text, params) => pool.query(text, params),
  checkoutClient: () => pool.connect()
}