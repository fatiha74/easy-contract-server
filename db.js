const Pool = require("pg").Pool;
// require('dotenv').config();

const pool = new Pool({
    user: 'fatiha',
    // user: "postgres",
     password: process.env.BDD_PASSWORD,
    // password:"FZRATdB65po3gh0AOJxt6lfbBCXf2Lfk",
    host: 'dpg-ceqp8u02i3mov0ikm0eg-a.frankfurt-postgres.render.com',

    //  port: process.env.PORT,
     port:5432,
    database: "easyc",
    // pour render
    ssl: true
});

module.exports = pool;