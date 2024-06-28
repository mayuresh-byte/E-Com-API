const express = require("express");
const router = express.Router();
const User = require("../models/User");
const cryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");

router.post("/register", async (req, res) => {
    const existingUser = await User.findOne({username: req.body.username});

    if(existingUser) {
        return res.status(411).json({
            message: "User alredy exists !!",
        })
    }

    try {
        const newUser = await User.create({
            username: req.body.username,
            email: req.body.email,
            password: cryptoJS.AES.encrypt(req.body.password, process.env.CRYPTO_PASS_SECRET),
        });

        res.status(201).json({
            message: newUser
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: error
        })
    }
});

router.post("/login", async (req, res) => {
    try {
        const user = await User.findOne({email: req.body.email});

        if(!user) {
            return res.status(401).json({
                msg: "Invalid EmailID !!!"
            })
        }

        const decryptedPassword = cryptoJS.AES.decrypt(user.password, process.env.CRYPTO_PASS_SECRET).toString(cryptoJS.enc.Utf8);

        if (decryptedPassword !== req.body.password) {
            return res.status(401).json({
                msg: "Invalid EmailID !!!"
            })
        } else {
            const token = jwt.sign({
                id: user._id,
                isAdmin: user.isAdmin
            }, process.env.JWT_SEC, {expiresIn: "3d"});

            const {password, ...others} = user._doc;
            return res.status(200).json({
                msg: "Logged in successfully  !!!",
                resp: {...others, token}
            })
        }

    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: error
        })
    }
    



    
});

module.exports = router;