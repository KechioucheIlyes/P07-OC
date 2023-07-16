const mongoose = require('mongoose');
require("dotenv").config()

const DB_NAME = process.env.DB_NAME
const DB_PASS = process.env.DB_PASS

const db = mongoose.connect(`mongodb+srv://${DB_NAME}:${DB_PASS}@cluster0.ectwkce.mongodb.net/?retryWrites=true&w=majority`)
.then(result => console.log("Connexion a la DB Reussie ! 🥳"))
.catch(err => console.log(err))

module.exports = db