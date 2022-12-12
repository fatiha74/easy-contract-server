const express = require("express");
const app = express();

const cors = require("cors");
// les routes
const entrepriseRouter = require('./routes/entreprise/entreprise.router.js');
const salarieRouter = require('./routes/salarie/salarie.router.js');
const contratRouter = require('./routes/contrat/contrat.router.js');


// middleware
app.use(cors());
app.use(express.json());
app.use('/entreprise',entrepriseRouter)
app.use('/salarie',salarieRouter)
app.use('/contrat',contratRouter)


// 
const start = async () => {
    try {
        app.listen(5000, console.log("Mon serveur fonctionne "))
    } catch (error) {
        console.log(error)
    }
}

start()
