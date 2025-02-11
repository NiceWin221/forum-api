/* istanbul ignore file */
require("dotenv").config();
const { Pool } = require("pg");

const testConfig = {
  host: process.env.PGHOST_TEST,
  port: process.env.PGPORT_TEST,
  user: process.env.PGUSER_TEST,
  password: process.env.PGPASSWORD_TEST,
  database: process.env.PGDATABASE_TEST,
  ssl: { rejectUnauthorized: false },
};

const productionConfig = {
  host: process.env.PGHOST,
  port: process.env.PGPORT,
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  database: process.env.PGDATABASE,
  ssl: { rejectUnauthorized: false },
};

const pool = process.env.NODE_ENV === "test" ? new Pool(testConfig) : new Pool(productionConfig);

module.exports = pool;
