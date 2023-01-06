const express = require('express');
const salarieRouter = express.Router();
const { registerSalarie, getAllSalarie, getOneSalarie, updateSalarie, deleteSalarie, loginSalarie, getProfile } = require('./salarie.controller')
const verifyToken = require('../../middleware/auth_middleware')



salarieRouter
    // * create salarie
    .post('/register', registerSalarie)

    // * login salarie
    .post('/login', loginSalarie)


    // ! on verifie le token  à chaque fois pour toutes les actions suivantes
    .use(verifyToken)

    // * read tous les salaries
    .get('/', getAllSalarie)

    // * read le profile
    .get('/profile', getProfile)

    // *read un salarie
    .get('/:id', getOneSalarie)

    // * update salarie
    // .put('/:id',updateSalarie)
    // * update salarie
    .put('/profile', updateSalarie)

    // *deleteSalarie
    .delete('/:id', deleteSalarie)


module.exports = salarieRouter;