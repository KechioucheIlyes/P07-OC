const express = require('express');
const User = require("../model/user")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
require("dotenv").config()



exports.signup =(req, res)=>{
    
    const {email , password} = req.body
    
    bcrypt.hash(password , 12)
    .then(hash =>{
        console.log(hash)
        new User({
            email , 
            password : hash
        })
        .save()
        .then(result =>{
            res.status(200).json({message : 'Enregistré avec succès !'})
        })
        .catch(err => console.log(err))
    })
    .catch(err => res.status(500).json({err}))
    

}
exports.login =(req, res)=>{
    const {email , password} = req.body
    
    
    // verifier dans la bdd // findOne by email et avec bcrypt on verifie l'origine du mdp hashé
    User.findOne({email})
    .then(user =>{
        if(!user){
            res.status(500).json({message : "email/mdp incorrecte !"})
        }
        else{
            
            bcrypt.compare(password , user.password)
            .then(valid => {
                if(!valid){

                    res.json({message : "email/mdp incorrecte !"});
                }
                else{
                    
                    res.json({userId :user._id , token : jwt.sign({userId : user._id} , process.env.TOKEN_KEY , {expiresIn : "12h"}) })
                }
            })
        }
    })
}