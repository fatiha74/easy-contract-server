const notFound = (req,res)=> res.status(404).send("la route n'existe pas")

module.exports = notFound