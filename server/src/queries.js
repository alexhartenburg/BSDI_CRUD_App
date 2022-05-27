const crypto = require('crypto');
const env = process.env.NODE_ENV || "development";
const config = require("../knexfile.js")[env];
const knex = require("knex")(config);

const register = async (firstName, lastName, username, password) => {
    const hash = crypto.createHash('sha256').update(password + username).digest('base64');
    return await knex("users")
        .insert({
            first_name: firstName,
            last_name: lastName,
            username: username,
            password: hash
        })
        .returning("id")
        .then(response => {
            return({
                id: response[0].id,
                firstName: firstName,
                lastName: lastName,
                username: username,
                password: hash
            })
        })
        .catch(err => false);
    
}

module.exports = {
    register
}