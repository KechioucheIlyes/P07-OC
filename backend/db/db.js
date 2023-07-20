const mongoose = require('mongoose');
require("dotenv").config()

const DB_NAME = process.env.DB_NAME
const DB_PASS = process.env.DB_PASS
const CLUST = process.env.CLUSTER
const db = mongoose.connect(`mongodb+srv://${DB_NAME}:${DB_PASS}@${CLUST}/?retryWrites=true&w=majority`)
    .then(result => console.log("Code 200 🥳 !"))
    .catch(err => console.log(err))

module.exports = db