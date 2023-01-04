const Pool = require("pg").Pool;
require('dotenv').config();

const pool = new Pool({
    user: "postgres",
    password: process.env.BDD_password,
    host: "localhost",
    port: process.env.PORT,
    database: "ec"
});

module.exports = pool;