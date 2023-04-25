const express = require('express')
const router = express.Router();
const jwt = require('jsonwebtoken')
// import bcrypt
const bcrypt = require("bcryptjs");

const UserModel = require('../db/user/user.model');

// this post API request finds User by username and set cookie with username as key 
router.post('/login', async function(req, res) {
    const username = req.body.username;
    let password = req.body.password;
    
    try {
        const createUserResponse = await UserModel.findUserByUsername(username)
        
        if (!bcrypt.compareSync(password, createUserResponse.password)) {
            return res.status(403).send("Invalid password")
        }

        const token = jwt.sign(username, "TWITTER_USER_PASSWORD")

        res.cookie("username", token);
        
        return res.send("User created successfully")
    
    } catch (e) {
        return res.status(401).send("Login failed");
    }
})

//this Post api request create a new user with username and password
router.post('/register', async function(req, res) {
    const username = req.body.username;
    let password = req.body.password;
    
    try {
        if(!username || !password) {
            return res.status(409).send("Missing username or password")
        }
        password = bcrypt.hashSync(password, 10);
      
        const createUserResponse = await UserModel.createUser({username: username, password: password});

        const token = jwt.sign(username, "TWITTER_USER_PASSWORD")

        res.cookie("username", token);
        
        return res.send("User created successfully")
    
    } catch (e) {
        return res.status(401).send("Error: username already exists");
    }
})

// This get api request checks if user is loggedIn or not via checking req cookies having username or not
router.get('/isLoggedIn', async function(req, res) {

    const username = req.cookies.username;

    if(!username) {
        return res.send({username: null})
    }
    let decryptedUsername;
    try {
        decryptedUsername = jwt.verify(username, "TWITTER_USER_PASSWORD")
    } catch(e) {
        return res.send({username: null})
    }
    
    if(!decryptedUsername) {
        return res.send({username: null})
    } else {
        return res.send({username: decryptedUsername})
    }

})

// this post API request is used to log out the user
router.post('/logOut', async function(req, res) {

    res.cookie('username', '', {
        maxAge: 0,
    })

    return res.send(true);
});

// this Get Api request is used for getting all details of user
router.get('/:username', async function(req, res) {
    const username = req.params.username;

    try{
        const userData = await UserModel.findUserByUsername(username);

        return res.send(userData);
    }
    catch(e) {
        return res.status(409).send("Error: username does not exists");
    }
    
})

module.exports = router