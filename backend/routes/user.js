const express = require('express');
const userCtrlr = require("../controllers/user")

const router = express.Router()




router.post("/signup" , userCtrlr.signup)
router.post('/login',userCtrlr.login)


module.exports= router


