const express = require('express');
const entrepriseRouter = express.Router();
const { createEntreprise, 
    getAllEntreprise, 
    getEntreprise,
     updateEntreprise,
      deleteEntreprise, 
      loginEntreprise,
       getProfileEntreprise} = require('./entreprise.controller')
const verifyToken = require('../../middleware/auth_middleware');
const { getAllSalarie } = require('../salarie/salarie.controller');
const { getOneSalarie } = require('../salarie/salarie.controller');
const {createContrat} =require('../contrat/contrat.controller');
entrepriseRouter
    // * create entreprise      
    .post('/', createEntreprise)

    // * create entreprise      
    .post('/registerEntreprise', createEntreprise)

    // * login entreprise       
    .post('/login', loginEntreprise)



    // ! on verifie le token  à chaque fois pour toutes les actions suivantes
    .use(verifyToken)

    // * read tous les entreprises
    .get('/', getAllEntreprise)

    //* pour le contrat
    .get('/addcontrat', getAllSalarie)

    .post('/addcontrat', createContrat)

// * pour un salarie choisie pour le contrat
    .get('/addcontrat/:id', getOneSalarie)

    // // *read un entreprise
    // .get('/:id',getEntreprise)

    // *read le profile de l'entreprise
    .get('/profile', getProfileEntreprise)

    // * update entreprise
    .put('/profile', updateEntreprise)

    // *deleteentreprise
    .delete('/', deleteEntreprise)



module.exports = entrepriseRouter;