require("dotenv").config()
const pool = require('../../db.js');
const isEmail = require('validator/lib/isEmail')
const jwt = require('jsonwebtoken')
// const SECRET = require('../../config')
const SECRET = process.env.SECRET
const hashPassword = require('../../middleware/hash_password.js');

const test = (async (req, res) => {
    try {
        res.json({ 'nom': 'ok' })
    }
    catch (err) {
        console.error(err.message)
    }
})


// ! LOGIN
// exports.loginEntreprise = async (req, res) => {
const loginEntreprise = async (req, res) => {
    console.log("login")
    // console.log(req)
  
    try {
        let {
            email,
            mdp
        } = req.body; // = const description = req.body.description
       
        //validate mail
        if (!isEmail(email)) {
            res.status(400).send('email invalid')
        }
     
        //!hash le password
        mdp = hashPassword(mdp)
      
        //vérifier si l'utilisateur existe

        let entreprise = await pool.query(`
            SELECT * 
            FROM entreprise 
            WHERE email=$1`
            , [email]);

        entreprise = entreprise.rows[0]
        
        // on recupere l'id
        let id = entreprise.entreprise_id
     
        if (!entreprise) {
            res.status(400).send('verifier vos identifiants')
            return false;
        }
        console.log(1);
        //comparer les mdp
        if (mdp !== entreprise.mdp) {
            console.log(mdp)
            res.status(400).send('verifier vos identifiants')
            return false;
        }
      
        //create the token
        const token = await jwt.sign(
            {
                email, mdp, id
            },
            SECRET,
            {
                expiresIn: "720h",
            }
        )
        // on envoit la reponse de la requete et le token
        res.json({ ...entreprise, token })
       
    } catch (err) {
        console.log("------------------------------------------");
        console.log(err.message);
        res.status(400).send(err.message)
    }
}


// const loginRouter = express.Router();

// ! GET all entreprise
const getAllEntreprise = (async (req, res) => {
    try {
        const allEntreprise = await pool.query("SELECT * FROM entreprise");
        console.log(allEntreprise)
        res.json(allEntreprise.rows);
    } catch (err) {

        res.status(400).send(err.message)
    }
})

// ! liste des salaries avec id entreprise
const getAllMySalaries = (async (req, res) => {
    try {
        const { id } = req.entreprise
        const allMySalaries = await pool.query
            (`SELECT
            salarie.pays_naissance, 
            salarie.lieu_naissance, 
            salarie.date_naissance, 
            salarie.num_ss, 
            salarie.nom_jeune_fille, 
            salarie.salarie_id, 
            salarie.mdp, 
            salarie.email, 
            salarie.ville, 
            salarie.cp, 
            salarie.rue, 
            salarie.telephone, 
            salarie.prenom, 
            salarie.nom, 
            salarie.civilite, 
            salarie.utilisateur_id, 
            contrat.fki_entreprise
            FROM
            salarie
            INNER JOIN
            contrat
            ON 
                contrat.fki_salarie = salarie.salarie_id
            WHERE
            contrat.fki_entreprise =  $1`, [id])
        res.json(allMySalaries.rows);
    } catch (err) {
        console.log(req.body)

        res.status(400).send(err.message)

    }
})

// ! GET une entreprise
const getEntreprise = (async (req, res) => {


    try {
        const { id } = req.entreprise
        // const { id } = verifyToken.req.entreprise
        // L'id passé en parametre dans l'url sur postman
        //  const { id } = req.params;
        const entreprise = await pool.query("SELECT * FROM entreprise WHERE entreprise_id = $1", [id]);
        res.json(entreprise.rows[0]);
    } catch (err) {
        console.log(req.body)
        res.status(400).send(err.message)
    }
})





// !CREATE
const createEntreprise = (async (req, res) => {

    try {

        // on recupere la valeur de l'attribut
        // let { civilite, nom, prenom, telephone, rue, cp, ville, email, mdp, role, siret, raison_sociale, code_ape } = req.body;

        // on recupere la valeur de l'attribut
        let { civilite, nom, prenom, telephone, rue, cp, ville, email, mdp, siret, raison_sociale, code_ape,signature } = req.body;
console.log("signature",signature)
        // la valeur dans values $1 recupere la description que l'on a ecrit sur postman
        // RETURNING * retourne à chaque fois la data ici description que l'on peut voir sur postman


        // * verification si l'entreprise existe déjà
        let verifExist = await pool.query("SELECT * from entreprise WHERE email=$1  ", [email]);

        if (verifExist.rowCount !== 0) {
            res.status(400).send("l'entreprise existe ")
        }

        //! on hash le mot de passe
        mdp = hashPassword(mdp);

        // avec role
        // let newEntreprise = await pool.query("INSERT INTO entreprise (civilite,nom,prenom,telephone,rue,cp,ville,email,mdp,role,siret,raison_sociale,code_ape) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13) RETURNING * ",
        //     [civilite, nom, prenom, telephone, rue, cp, ville, email, mdp, role, siret, raison_sociale, code_ape]);

        let newEntreprise = await pool.query(`INSERT INTO entreprise 
        (civilite,
            nom,
            prenom,
            telephone,
            rue,
            cp,
            ville,
            email,
            mdp,
            siret,
            raison_sociale,
            code_ape,
            signature) 
        VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13) 
        RETURNING * `,
            [civilite, nom, prenom, telephone, rue, cp, ville, email, mdp, siret, raison_sociale, code_ape,signature]);
        console.log(newEntreprise)
        // * recuperer le id de l'entreprise qui vient d'etre cree
        let ent = newEntreprise.rows[0]
        let id = ent.entreprise_id
        let role = ent.entreprise_role

        //! create the token
        const token =  jwt.sign(
            {
                email, mdp, id, role
            },
            SECRET,
            {
                expiresIn: "720h",
            }
        )

        res.json({ ...newEntreprise, token })
        console.log(req.body)
    } catch (err) {
        res.status(400).send(err.message)
    }

})


// !UPDATE
const updateEntreprise = (async (req, res) => {

    // console.log(req.params);
    // const { id } = req.entreprise
    console.log('ok')
    const { id } = req.entreprise

    try {
        // L'id passé en parametre dans l'url sur postman
        // const { id } = req.params;

        let { civilite, nom, prenom, telephone, rue, cp, ville, email, mdp, role, siret, raison_sociale, code_ape } = req.body.formulaire;

        console.log(req.body.formulaire)
        //! validate mail
        if (!isEmail(email)) {
            res.status(400).send('email invalid')
        }

        //!hash le password
        mdp = hashPassword(mdp)

        // *on verifie si le entreprise existe deja
        // * verification si l'entreprise existe déjà
        let verifExist = await pool.query("SELECT * from entreprise WHERE email=$1 AND entreprise_id <> $2 ", [email, id]);
        console.log(email)

        if (verifExist.rowCount !== 0) {
            res.status(400).send("l'entreprise existe déjà")
            return false;
        }

        // [description, id] == [argument 1 $1, argument 2 $2]
        let updateEntreprise = await pool.query("UPDATE entreprise SET civilite=$1,nom = $2, prenom = $3,telephone=$4,rue = $5, cp = $6,ville=$7,email=$8,mdp=$9 ,role=$10,siret=$11, raison_sociale= $12, code_ape=$13  WHERE entreprise_id = $14",
            [civilite, nom, prenom, telephone, rue, cp, ville, email, mdp, role, siret, raison_sociale, code_ape, id]);

            let updatedEntreprise = await pool.query("SELECT * from entreprise where entreprise_id=$1",[id])
        console.log(updateEntreprise)
        res.json(updatedEntreprise.rows[0])
    } catch (err) {
        res.status(400).send({ MESSAGE: err.message, erreur: "update" })
    }

})

// !DELETE
const deleteEntreprise = (async (req, res) => {
    try {
        // je recupere le parametre id passer dans l'url
        const { id } = req.params;
        const deleteEntreprise = await pool.query("DELETE FROM entreprise WHERE entreprise_id = $1", [id]);
        res.json("l'entreprise est supprimé!")

    } catch (err) {
        res.status(400).send('verifier votre identifiant')
    }
    res.send('delete')
})



// ! GET PROFILE
const getProfileEntreprise = (async (req, res) => {
    const { id } = req.entreprise

    try {
        const entreprise = await pool.query(`
        SELECT * 
        FROM entreprise 
        where entreprise_id=$1`, [id]);
        res.json(entreprise.rows[0]);
    } catch (err) {
        res.status(400).send(err.message)
    }
})



// !on exporte les constantes

module.exports = {
    getAllEntreprise,
    getEntreprise,
    createEntreprise,
    updateEntreprise,
    deleteEntreprise,
    loginEntreprise,
    getProfileEntreprise,
    getAllMySalaries,
    test

}
