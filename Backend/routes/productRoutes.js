import express from "express";
import Product from "../models/Product.js";
import { protect } from "../middleware/authMiddleware.js";
import { adminOnly } from "../middleware/adminMiddleware.js";

const router = express.Router();


// =====================================================
// GET /api/products
// Fetch all products (PUBLIC)
// =====================================================
router.get("/", async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch products",
    });
  }
});


// =====================================================
// GET /api/products/:id
// Fetch single product (PUBLIC)
// =====================================================
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      product,
    });

  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Invalid product ID",
    });
  }
});


// =====================================================
// POST /api/products
// Add new product (ADMIN ONLY)
// =====================================================
router.post("/", protect, adminOnly, async (req, res) => {
  try {
    const product = await Product.create(req.body);

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      product,
    });

  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
});


// =====================================================
// PUT /api/products/:id
// Update product (ADMIN ONLY)
// =====================================================
router.put("/:id", protect, adminOnly, async (req, res) => {
  try {
    let product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      product,
    });

  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
});


// =====================================================
// DELETE /api/products/:id
// Delete product (ADMIN ONLY)
// =====================================================
router.delete("/:id", protect, adminOnly, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    await product.deleteOne();

    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });

  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Invalid product ID",
    });
  }
});

export default router;
