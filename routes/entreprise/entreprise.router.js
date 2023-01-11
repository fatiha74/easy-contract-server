const express = require('express');
const entrepriseRouter = express.Router();
const { createEntreprise,
    getAllEntreprise,
    test,
    getEntreprise,
    updateEntreprise,
    deleteEntreprise,
    loginEntreprise,
    getProfileEntreprise,
    getAllMySalaries } = require('./entreprise.controller')
const verifyToken = require('../../middleware/auth_middleware');
const { getAllSalarie } = require('../salarie/salarie.controller');
const { getOneSalarie } = require('../salarie/salarie.controller');
const { createContrat, getContratCree, getAllMyContratEntreprise, getContratEnCours } = require('../contrat/contrat.controller');
entrepriseRouter


    // * create entreprise      
    .post('/register', createEntreprise)

    // * login entreprise       
    .post('/login', loginEntreprise)

    .get('/test', test)

// // ! on verifie le token  à chaque fois pour toutes les actions suivantes
.use(verifyToken)

// * read tous les entreprises
.get('/', getAllEntreprise)

//* pour le contrat
.get('/addcontrat', getAllSalarie)
.post('/addcontrat', createContrat)
.get('/addcontrat/:id', getContratCree)
.get('/mescontrats', getAllMyContratEntreprise)
.get('/contratsencours', getContratEnCours)



// * pour un salarie choisie pour le contrat
.get('/salarie/:id', getOneSalarie)
// * la liste de mes salariés 
.get('/messalaries', getAllMySalaries)

// // *read un entreprise
// .get('/:id',getEntreprise)

// *read le profile de l'entreprise
.get('/profile', getProfileEntreprise)

// * update entreprise
.put('/profile', updateEntreprise)

// *deleteentreprise
.delete('/', deleteEntreprise)



module.exports = entrepriseRouter;