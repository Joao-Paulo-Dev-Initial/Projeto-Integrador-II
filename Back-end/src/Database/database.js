const { Pool } = require("pg");
require("dotenv").config();

const database = new Pool({
    connectionString: process.env.DATABASE_URL,
});

module.exports = database;