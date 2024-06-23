const express = require("express");
const router = express.Router();
const User = require("../models/User");
const cryptoJS = require("crypto-js");
const { verifyTokenAndAuthorization, verifyTokenAndAdmin } = require("../middlewares/verifyToken");

// Update user
router.put("/:id", verifyTokenAndAuthorization, async (req, res) => {
    if(req.body.password) {
        req.body.password = cryptoJS.AES.encrypt(req.body.password, process.env.CRYPTO_PASS_SECRET).toString();
    }

    try {
        const updateUser = await User.findByIdAndUpdate(req.params.id, {
            $set: req.body,
        }, {new: true});
        res.status(200).json(updateUser);
    } catch (error) {
        res.status(500).json(err);
    }
})

// Delete user:
router.delete("/:id", verifyTokenAndAuthorization, async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.status(200).json("user has been deleted...");
    } catch (error) {
        res.status(500).json(err);
    }
});

// Get User:
router.get("/find/:id", verifyTokenAndAdmin, async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json(err);
    }
});

// Get All Users:
router.get("/", verifyTokenAndAdmin, async (req, res) => {
    const query = req.query.new;
    try {
        const users = query ? await User.find().sort({_id:-1}).limit(2) : await User.find();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json(err);
    }
});


// Get User stats:
router.get("/stats", verifyTokenAndAdmin, async (req, res) => {
    const date = new Date();
    const lastYear = new Date(date.setFullYear(date.getFullYear()-1));

    try {
        const data = await User.aggregate([
          { $match: { createdAt: { $gte: lastYear } } },
          {
            $project: {
              month: { $month: "$createdAt" },
            },
          },
          {
            $group: {
              _id: "$month",
              total: { $sum: 1 },
            },
          },
        ]);
        res.status(200).json(data)
      } catch (err) {
        res.status(500).json(err);
      }
});

module.exports = router;


