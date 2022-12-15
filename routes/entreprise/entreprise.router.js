const express = require('express');
const entrepriseRouter = express.Router();
const { createEntreprise, getAllEntreprise, getEntreprise, updateEntreprise, deleteEntreprise, loginEntreprise, getProfileEntreprise } = require('./entreprise.controller')
const verifyToken = require('../../middleware/auth_middleware')


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

    // // *read un entreprise
    // .get('/:id',getEntreprise)

    // *read le profile de l'entreprise
    .get('/profile', getProfileEntreprise)

    // * update entreprise
    .put('/profile', updateEntreprise)

    // *deleteentreprise
    .delete('/', deleteEntreprise)



module.exports = entrepriseRouter;