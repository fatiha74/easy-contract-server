const express = require('express');
const contratRouter = express.Router();


const {
    getAllContrat,
    getContrat,
    createContrat ,
    updateContrat,
    deleteContrat
} = require('./contrat.controller.js')


// on ajoute les constantes correspondantes à chaque route
contratRouter.route('/contrat')
    .get(getAllContrat)
    .post(createContrat)


contratRouter.route('/contrat/:id')
    .get(getContrat)
    .put(updateContrat)
    .delete(deleteContrat);

module.exports = contratRouter;