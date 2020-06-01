require("dotenv").config();
const pg = require("pg");
require("pg-camelcase").inject(pg);

// const types = pg.types;

// types.setTypeParser(1114, stringVal => stringVal);

let pool;
const { NODE_ENV, DATABASE_URL } = process.env;
if (NODE_ENV === "production" && DATABASE_URL) {
  pool = new pg.Pool({
    connectionString: DATABASE_URL,
    ssl: {
      rejectUnauthorized: false,
    },
  });

} else {
  pool = new pg.Pool();
}

module.exports = {
  query: (text, params) => pool.query(text, params),
  checkoutClient: () => pool.connect(),
};
