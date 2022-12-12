const crypto = require("crypto");

function hashPassword(password) {
    let hashedPassword = crypto
        .createHash("sha256")
        .update(password)
        .digest("hex");

    return hashedPassword;
}

module.exports=hashPassword