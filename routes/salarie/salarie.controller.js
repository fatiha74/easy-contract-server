const pool = require('../../db.js')
// const loginRouter = express.Router();
const hashPassword = require('../../middleware/hash_password.js');

const jwt = require('jsonwebtoken')
const SECRET = require('../../middleware/config.js')

const isEmail = require('validator/lib/isEmail')

// ! GET all salarie
const getAllSalarie = (async (req, res) => {
    try {
        const allSalarie = await pool.query("SELECT * FROM salarie");
        res.json(allSalarie.rows);
    } catch (err) {
        console.error(err.message)
    }
})


// ! GET un salarie
const getSalarie = (async (req, res) => {

    try {
        // L'id passé en parametre dans l'url sur postman
        const { id } = req.params;
        const salarie = await pool.query("SELECT * FROM salarie WHERE salarie_id = $1", [id]);
        res.json(salarie.rows[0]);
        console.log(req.params)
    } catch (err) {
        console.error(err.message)
    }

})

// !CREATE
const createSalarie = (async (req, res) => {
    try {

        // on recupere les valeurs du formulaire
        let { civilite, nom, prenom, rue, ville, cp, telephone, email, mdp, nom_jeune_fille, num_ss, date_naissance, lieu_naissance, pays_naissance, role } = req.body;
        // la valeur dans values $1 recupere la description que l'on a ecrit sur postman
        // RETURNING * retourne à chaque fois la data ici description que l'on peut voir sur postman

        // *on verifie si le salarie existe deja
        // * verification si l'entreprise existe déjà
        let verifExist = await pool.query("SELECT * from salarie WHERE email=$1", [email]);
        console.log(verifExist)

        if (verifExist.rowCount !== 0) {
            res.status(400).send('le salarie existe déjà')
            return false;
        }

        //! on hash le mot de passe, RGPD le mdp ne doit pas etre en clair
        mdp = hashPassword(mdp);

        let newSalarie = await pool.query("INSERT INTO salarie (civilite,nom,prenom,rue,ville,cp,telephone,email,mdp,nom_jeune_fille,num_ss,date_naissance,lieu_naissance,pays_naissance,role) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15) RETURNING * ", 
        [civilite, nom, prenom, rue, ville, cp, telephone, email, mdp, nom_jeune_fille, num_ss, date_naissance, lieu_naissance, pays_naissance, role]);

        // * recuperer le id de l'entreprise qui vient d'etre cree
        salarie = newSalarie.rows[0]
        let id = salarie.salarie_id


        
        //!create the token
        const token = jwt.sign(
            {
                email, mdp, id
            },
            SECRET,
            {
                expiresIn: "720h",
            }
        )

        res.json({ ...newSalarie, token })

        console.log(req.body)
    } catch (err) {
        console.error(err.message)
    }

})

// !UPDATE
const updateSalarie = (async (req, res) => {

    console.log(req.params);
// on recupere l'id de la personne connecté grace au token
    const { id } = req.salarie;

    try {
        // L'id passé en parametre dans l'url sur postman

        // let { id } = req.params;
        // on recupere du formulaire
        let { civilite, nom, prenom,telephone, rue,cp,ville, email, mdp,role, nom_jeune_fille,num_ss, date_naissance, lieu_naissance, pays_naissance} = req.body;
     
        //! validate mail
        if (!isEmail(email)) {
            res.status(400).send('email invalid')
        }
        
        //!hash le password
        mdp = hashPassword(mdp)

        
        // *on verifie si le salarie existe deja
      
        let verifExist = await pool.query("SELECT * from salarie WHERE email=$1 AND salarie_id <> $2 ", [email, id]);
        console.log(email)

        if (verifExist.rowCount !== 0) {
            res.status(400).send('le salarie existe déjà')
            return false;
        }

   

        // [description, id] == [argument 1 $1, argument 2 $2]
        let updateSalarie = await pool.query("UPDATE salarie SET civilite=$1,nom = $2, prenom = $3, telephone=$4,rue = $5, cp = $6,ville=$7,email=$8, mdp= $9, role=$10,nom_jeune_fille=$11, num_ss=$12,date_naissance=$13,lieu_naissance=$14,pays_naissance=$15 WHERE salarie_id = $16", 
        [civilite, nom, prenom,telephone, rue,cp,ville, email, mdp, role,nom_jeune_fille,num_ss, date_naissance, lieu_naissance, pays_naissance, id]);
        res.json(updateSalarie)
    }
    catch (err) {
        console.error(err.message)
        res.status(400).send(err.message)
    }

})

// !DELETE
const deleteSalarie = (async (req, res) => {
    try {
        // je recupere le parametre id passer dans l'url
        const { id } = req.params;
        const deleteSalarie = await pool.query("DELETE FROM salarie WHERE salarie_id = $1", [id]);
        res.json("le salarie est supprimé!")

    } catch (err) {
        console.error(err.message)
        res.status(400).send('le salarie existe déjà')
    }
})

// ! LOGIN
// exports.loginEntreprise = async (req, res) => {
const loginSalarie = async (req, res) => {
    try {
        ;
        let {
            email,
            mdp
        } = req.body; // = const description = req.body.description

        //validate mail
        if (!isEmail(email)) {
            console('')
            res.status(400).send('email invalid')
        }

        //!hash le password
        mdp = hashPassword(mdp)

        //vérifier si l'utilisateur existe

        let salarie = await pool.query("SELECT * FROM salarie WHERE email=$1", [email]);


        salarie = salarie.rows[0]

        if (!salarie) {
            res.status(400).send('verifier vos identifiant')
            return false;
        }

        //comparer les mdp
        console.log(`mdp: ${mdp}, mdp BDD: ${salarie.mdp}`);
        if (mdp !== salarie.mdp) {
            console.log(mdp)
            res.status(400).send('verifier votre mot de passe')
            return false;
        }

        // * on recupere le id du salarie
        // salarie = salarie.rows[0]
        let id = salarie.salarie_id


        //!create the token
        const token = jwt.sign(
            {
                email, mdp, id
            },
            SECRET,
            {
                expiresIn: "720h",
            }
        )

        res.json({ ...salarie, token })

    } catch (err) {
        console.log("------------------------------------------");
        console.log(err.message);
        res.status(400).send('le salarie existe déjà')

    }

}


// ! GET PROFILE
const getProfile = (async (req, res) => {
const {id} = req.salarie
    console.log()
    try {
        const allSalarie = await pool.query("SELECT * FROM salarie where salarie_id=$1",[id]);
        res.json(allSalarie.rows);
    } catch (err) {
        console.error(err.message)
        res.status(400).send(err.message)
    }
})
// on exporte les constantes

module.exports = {
    getAllSalarie,
    getSalarie,
    createSalarie,
    updateSalarie,
    deleteSalarie,
    loginSalarie,
    getProfile
}
