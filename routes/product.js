const express = require("express");
const router = express.Router();
const Product = require("../models/Product");
const { verifyTokenAndAdmin } = require("../middlewares/verifyToken");

// Create Product

router.post("/", verifyTokenAndAdmin, async (req, res) => {
    try {
        const newProduct = await Product.create(req.body);
        res.status(200).json({"newProduct": newProduct});
    } catch (error) {
        res.status(500).json(err);
    }
})

// Update Prod
router.put("/:id", verifyTokenAndAdmin, async (req, res) => {
    try {
        const updateProduct = await Product.findByIdAndUpdate(req.params.id, {
            $set: req.body,
        }, {new: true});
        res.status(200).json(updateProduct);
    } catch (error) {
        res.status(500).json(err);
    }
})

// Delete Prod:
router.delete("/:id", verifyTokenAndAdmin, async (req, res) => {
    try {
        await Product.findByIdAndDelete(req.params.id);
        res.status(200).json("Product has been deleted...");
    } catch (error) {
        res.status(500).json(err);
    }
});

// Get Product:
router.get("/find/:id", async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json(err);
    }
});

// Get All Prods:
router.get("/", async (req, res) => {
    const query = req.query.new;
    const queryCategory = req.query.category;
    try {
        let products;
        if (query) {
            products = await Product.find().sort({createdAt: -1}).limit(5);
        } else if (queryCategory) {
            products = await Product.find({
                categories: {
                  $in: [queryCategory],
                },
            });
        } else {
            products = await Product.find();
        }
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json(err);
    }
});

module.exports = router;
