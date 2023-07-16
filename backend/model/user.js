const mongoose = require('mongoose');
const validator = require("mongoose-unique-validator")



const User = new mongoose.Schema({
    email : {type : String , required : true  , unique : true },
    password : {type : String , required : true }

})

User.plugin(validator)


module.exports = mongoose.model("user" , User)


