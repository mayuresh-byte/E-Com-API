const express = require("express");
const router = express.Router();
const Cart = require("../models/Cart");
const { verifyTokenAndAuthorization, verifyTokenAndAdmin, verifyToken } = require("../middlewares/verifyToken");

// Create Cart
router.post("/", verifyToken, async (req, res) => {
    try {
        const newCart = await Cart.create(req.body);
        res.status(200).json({"newCart": newCart});
    } catch (error) {
        res.status(500).json(err);
    }
})

// Update Cart
router.put("/:id", verifyTokenAndAuthorization, async (req, res) => {
    try {
        const updateCart = await Cart.findByIdAndUpdate(req.params.id, {
            $set: req.body,
        }, {new: true});
        res.status(200).json(updateCart);
    } catch (error) {
        res.status(500).json(err);
    }
})

// Delete Cart:
router.delete("/:id", verifyTokenAndAuthorization, async (req, res) => {
    try {
        await Cart.findByIdAndDelete(req.params.id);
        res.status(200).json("Cart has been deleted...");
    } catch (error) {
        res.status(500).json(err);
    }
});

// Get Cart:
router.get("/find/:userId", verifyTokenAndAuthorization, async (req, res) => {
    try {
        const cart = await Cart.findOne({userId: req.params.userId});
        res.status(200).json(cart);
    } catch (error) {
        res.status(500).json(err);
    }
});

// Get All Carts:
router.get("/", verifyTokenAndAdmin, async (req, res) => {
    try {
        const carts = Cart.find();
        res.status(200).json(carts);
    } catch (error) {
        res.status(500).json(err);
    }
});

module.exports = router;
