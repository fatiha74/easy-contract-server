const Pool = require("pg").Pool;

const pool = new Pool({
    user: "postgres",
    password: "digifab74",
    host: "localhost",
    port: 5432,
    database: "ec"
});

module.exports = pool;