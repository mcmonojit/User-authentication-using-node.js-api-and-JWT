const router = require('express').Router();
const User = require('../model/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { registerValidation, loginValidation } = require('../validation');
    


router.post('/register', async (req, res) => {

    //VALIDATE THE DATA BEFORE USER IS CREATED

    const { error } = registerValidation(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    //if already present in the DB
    const emailExist = await User.findOne({email: req.body.email});
    if (emailExist) return res.status(400).send('Email already exist'); 

    //encrypt password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt); 

    //create new user
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword
    });
    
    try{
        const savedUser = await user.save();
        res.send({user: user._id});
    } catch (err) {
        res.status(400).send(err);
    }
});


    //LOGIN
    router.post('/login', async (req, res) => {

        //VALIDATE THE DATA given by USER
    
        const { error } = loginValidation(req.body);
        if(error) return res.status(400).send(error.details[0].message);
    
        //if email doesnt exist in the DB
        const user = await User.findOne({email: req.body.email});
        if (!user) return res.status(400).send('Email ID not found');
        
        //correct password
        const validP = await bcrypt.compare(req.body.password, user.password);
        if(!validP) return res.status(400).send('Invalid Password')

       
        //create token
        const token = jwt.sign({_id: user._id}, process.env.TOKEN_SECRET);
        res.header('auth-token', token).send(token); 

    });

module.exports = router;  