const pool = require('../../db.js')

// ! GET all contrat
const getAllContrat = (async (req, res) => {
    try {
        const allContrat = await pool.query("SELECT * FROM contrat");
        console.log(allContrat)
        res.json(allContrat.rows);
    } catch (err) {
        console.error(err.message)
    }
})

// ! GET un contrat
const getContrat = (async (req, res) => {
    try {
        // L'id passé en parametre dans l'url sur postman
        const { id } = req.params;
        const contrat = await pool.query("SELECT * FROM contrat WHERE contrat_id = $1", [id]);
        res.json(contrat.rows[0]);
        console.log(req.params)
    } catch (err) {
        console.error(err.message)
    }
})

// !CREATE
const createContrat = (async (req, res) => {
    try {

        // on recupere la valeur de l'attribut
        const { fki_entreprise,fki_salarie,type_contrat,is_fulltime,date_debut,date_fin,periode_essai,motif,fonction,statut} = req.body;
        // la valeur dans values $1 recupere la description que l'on a ecrit sur postman
        // RETURNING * retourne à chaque fois la data ici description que l'on peut voir sur postman
        const newContrat = await pool.query(
            "INSERT INTO Contrat (fki_entreprise,fki_salarie,type_contrat,is_fulltime,date_debut,date_fin,periode_essai,motif,fonction,statut) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING * ", [fki_entreprise,fki_salarie,type_contrat,is_fulltime,date_debut,date_fin,periode_essai,motif,fonction,statut]);
        res.json(newContrat.rows[0])
        console.log(req.body)
    } catch (err) {
        console.error(err.message)
    }
    
})

// !UPDATE
const updateContrat = (async (req, res) => {

    console.log(req.params);

    try {
        // L'id passé en parametre dans l'url sur postman

        const { id } = req.params;
        const { entreprise_id,salarie_id,type_contrat,is_fulltime,date_debut,periode_fin_essai,motif_recrutement,fonction,statut } = req.body;

        // [description, id] == [argument 1 $1, argument 2 $2]
        const updateContrat = await pool.query("UPDATE contrat SET entreprise_id = $1, salarie_id = $2, type_contrat = $3,is_fulltime=$4,date_debut = $5, date_fin_essai = $6,motif=$7,recrutement= $8,fonction=$9, statut= $10,  WHERE contrat_id = $11", [entreprise_id,salarie_id,type_contrat,is_fulltime,date_debut,periode_fin_essai,motif_recrutement,fonction,statut, id]);


        res.json(updateContrat)
    } catch (err) {
        console.error(err.message)
    }

})

// !DELETE
const deleteContrat = (async (req, res) => {
    try {
        // je recupere le parametre id passer dans l'url
        const { id } = req.params;
        const deleteContrat = await pool.query("DELETE FROM contrat WHERE contrat_id = $1", [id]);
        res.json("le Contrat est supprimé!")

    } catch (err) {
        console.error(err.message)
    }
    res.send('delete')
})

// on exporte les constantes

module.exports = {
    getAllContrat,
    getContrat,
    createContrat,
    updateContrat,
    deleteContrat
}
