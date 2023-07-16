const http = require("http")
const app = require('./app')
require("dotenv").config()


const server = http.createServer(app)
const PORT = process.env.PORT


server.listen(PORT , ()=>{
    console.log(`Listening on port ${PORT}`)
})

