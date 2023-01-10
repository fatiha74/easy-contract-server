const SECRET = require('../config');
const jwt = require("jsonwebtoken");


/**
 *
 * @param req
 * @param res
 * @param next
 * @return {*}
 */
function verifyToken(req, res, next) {
    let token = req.headers["authorization"];

    if (!token) {
        return res.status(403).send("Forbidden");
    }

    try {
        console.log(SECRET);
        const decoded = jwt.verify(token, SECRET);
        // pour acceder au payload
        req.entreprise = decoded;

        req.salarie = decoded;

    } catch (err) {
        return res.status(401).json(err);
    }
    return next();
}

module.exports = verifyToken
