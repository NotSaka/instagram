const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = mongoose.model("User");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')
const {JWT_SECRET} = require('../keys')
const requireLogin = require('../middleware/requireLogin')

router.get('/protected', requireLogin,(req,res)=>{
    res.send("hello user")
})

router.post('/signup', (req, res) => {
    const { name, email, password } = req.body;
    if (!email || !password || !name) {
        return res.status(422).json({ error: "Please add all the mandatory fields" });
    }

    User.findOne({ email: email })
        .then((savedUser) => {
            if (savedUser) {
                return res.status(422).json({ error: "User already exists with that email" });
            }
            bcrypt.hash(password, 12)
                .then(hashedpassword => {
                    const user = new User({
                        email,
                        password:hashedpassword,
                        name
                    });

                    user.save()
                        .then(user => {
                            res.json({ message: "saved successfully" });
                        })
                        .catch(err => {
                            console.log(err);
                        });
                });
        })
        .catch(err => {
            console.log(err);
        });
});

router.post('/signin',(req,res)=>{
    const {email,password} = req.body   //destructure the request body and save them to the const variables
    if(!email || !password){
        return res.status(422).json({error : "Please provide email and password to proceed"})
    }
    User.findOne({email:email})
    .then(savedUser=>{
        if(!savedUser){
            res.status(422).json({error : "Invalid or Wrong email/password combination"})
        }
        bcrypt.compare(password,savedUser.password)
        .then(doMatch=>{
            if(doMatch){
                const token = jwt.sign({_id : savedUser._id}, JWT_SECRET)
                res.json({token}) // {token : token} can be condensed down to just token
               // res.json({message : "successfully logged in"})
            } else {
                res.status(422).json({error : "Invalid or Wrong email/password combination"})    
            }
        })
        .catch(err=>{
            console.log(err)
        })
    })
})
module.exports = router;