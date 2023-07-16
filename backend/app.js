const express = require('express');
const routerBooks = require("./routes/books")
const routerUser = require("./routes/user")
const cors = require("cors")
const path = require("path")
require("./db/db")
const app = express()







app.use(cors())
app.use(express.urlencoded({extended : true}))
app.use(express.json())

app.use("/api/books" , routerBooks)
app.use("/api/auth", routerUser)
app.use('/images', express.static(path.join(__dirname, 'images')))



module.exports = app 