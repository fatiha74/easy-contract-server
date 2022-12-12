const express = require('express');
const salarieRouter = express.Router();
const {createSalarie,getAllSalarie,getSalarie,updateSalarie,deleteSalarie,loginSalarie,getProfile} = require('./salarie.controller')
const verifyToken = require('../../middleware/auth_middleware')



salarieRouter
// * create salarie
.post('/',createSalarie)

// * login salarie
.post('/login',loginSalarie)

// ! on verifie le token  à chaque fois pour toutes les actions suivantes
.use(verifyToken)

// * read tous les salaries
.get('/',getAllSalarie)

// * read le profile
.get('/',getProfile)

// *read un salarie
.get('/:id',getSalarie)

// * update salarie
// .put('/:id',updateSalarie)
// * update salarie
.put('/',updateSalarie)

// *deleteSalarie
.delete('/:id',deleteSalarie)


module.exports = salarieRouter;