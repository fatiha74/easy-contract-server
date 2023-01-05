const express = require('express');
const contratRouter = express.Router();


const {
    getAllContrat,
    getContrat,
    createContrat ,
    updateContrat,
    deleteContrat,
    getContratCree,
    getContratEnCours
} = require('./contrat.controller.js')


// on ajoute les constantes correspondantes à chaque route
contratRouter.route('/contrat')
    .get(getAllContrat)
    .post(createContrat)
    .get(getContratEnCours)


contratRouter.route('/contrat/:id')
    .get(getContrat)
    .get(getContratCree)
    .put(updateContrat)
    .delete(deleteContrat);

module.exports = contratRouter;