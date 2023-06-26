const express = require('express')
require('dotenv').config();
const router = express.Router();
const User = require("../models/User");
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fetchuser = require("../middleware/fetchuser"); // Get the user from jwt and add id to the req

const JWT_SECRET = "Password";


//ROUTE-1 Create a User using POST "api/auth/createuser". Doesn't require login
router.post('/createuser', [body('name', 'Enter a valid name').isLength({ min: 3 }), body('email', 'Enter a valid Email').isEmail(), body('password', 'Password must be atleast 5 characters').isLength({ min: 5 })], async (req, res) => {

    //  If there are errors, return bad request and the errors
    const errors = validationResult(req);
    let success = false;
    if (!errors.isEmpty()) {
        return res.status(400).json({success, errors: errors.array() });
    }

    try {
        //  Check whether the user with this email exists already
        let user = await User.findOne({ email: req.body.email });
        if (user) {
            return res.status(400).json({success, error: "Sorry a user with this email aleady exists" })
        }
        // Hashing the password using salt and hash
        const salt = await bcrypt.genSalt(10);
        const secPass = await bcrypt.hash(req.body.password, salt);
        // Create new user
        user = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: secPass
        });

        const data = {
            user: {
                id: user.id
            }
        };
        // Signing our data which has id in it and sending the authtoken
        const authToken = jwt.sign(data, JWT_SECRET);
        success = true;
        res.json({success, authToken });

    } catch (error) {
        console.error(error.message);
        res.status(500).send("Some Error occured")
    }
});


//ROUTE-2 Login a User using POST "api/auth/login". Doesn't require login
router.post('/login', [body('email', 'Enter a valid Email').isEmail(), body('password', 'Password cannot be blank').exists()], async (req, res) => {

    //  If there are errors, return bad request and the errors
    let success = false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { email, password } = req.body;
    try {
        // Checking if the user exists or not if exists campare the entered password with the password which is encrpyted
        let user = await User.findOne({ email });
        if (!user) {
            success = false;
            return res.status(400).json({success, error: "Please try to login with correct credientials" });
        }
        // checking password
        const passwordCompare = await bcrypt.compare(password, user.password);
        if (!passwordCompare) {
            success = false;
            return res.status(400).json({ success, error: "Please try to login with correct credientials" });
        }

        const data = {
            user: {
                id: user.id
            }
        };
        // sending token
        const authToken = jwt.sign(data, JWT_SECRET);
        success = true;
        res.json({ success, authToken });

    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal server Error")
    }
});


// ROUTE-3 get logged in user details using POST "api/auth/getuser". require login
router.post('/getuser', fetchuser, async (req, res) => {

    try {
        const userId = req.user.id;
        // select except password
        const user = await User.findById(userId).select("-password");
        res.send({ user })

    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal server Error")
    }
});


module.exports = router;