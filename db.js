const Pool = require("pg").Pool;
require('dotenv').config();

const pool = new Pool({
    user: "fatiha",
    // user: "postgres",
    password: process.env.BDD_password,
    host: "dpg-ceqp8u02i3mov0ikm0eg-a.frankfurt-postgres.render.com",
  
    port: process.env.PORT,
    database: "ec",
    // pour render
     ssl:true
});

module.exports = pool;