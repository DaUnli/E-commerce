import express from "express";
import Cart from "../models/Cart.js";
import Product from "../models/Product.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// =========================================
// POST /api/cart
// Add product to cart
// =========================================
router.post("/", protect, async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    let cart = await Cart.findOne({ userId: req.user._id });

    if (!cart) {
      cart = await Cart.create({
        userId: req.user._id,
        products: [
          {
            productId,
            quantity,
            price: product.price,
          },
        ],
      });
    } else {
      const itemIndex = cart.products.findIndex(
        (p) => p.productId.toString() === productId,
      );

      if (itemIndex > -1) {
        // Update quantity if product exists
        cart.products[itemIndex].quantity += quantity;
      } else {
        cart.products.push({
          productId,
          quantity,
          price: product.price,
        });
      }

      await cart.save();
    }

    res.status(200).json({
      success: true,
      message: "Product added to cart",
      cart,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error adding to cart",
    });
  }
});

// =========================================
// GET /api/cart
// Get logged in user's cart
// =========================================
router.get("/", protect, async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user._id }).populate(
      "products.productId",
      "name price images",
    );

    if (!cart) {
      return res.status(200).json({
        success: true,
        cart: { products: [], totalPrice: 0 },
      });
    }

    // Calculate total price
    const totalPrice = cart.products.reduce(
      (total, item) => total + item.quantity * item.price,
      0,
    );

    res.status(200).json({
      success: true,
      cart,
      totalPrice,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching cart",
    });
  }
});

// =========================================
// PUT /api/cart/:productId
// Update quantity
// =========================================
router.put("/:productId", protect, async (req, res) => {
  try {
    const { quantity } = req.body;

    const cart = await Cart.findOne({ userId: req.user._id });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    const item = cart.products.find(
      (p) => p.productId.toString() === req.params.productId,
    );

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Product not in cart",
      });
    }

    item.quantity = quantity;

    await cart.save();

    res.status(200).json({
      success: true,
      message: "Cart updated",
      cart,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating cart",
    });
  }
});

// =========================================
// DELETE /api/cart/:productId
// Remove product from cart
// =========================================
router.delete("/:productId", protect, async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user._id });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    cart.products = cart.products.filter(
      (p) => p.productId.toString() !== req.params.productId,
    );

    await cart.save();

    res.status(200).json({
      success: true,
      message: "Product removed from cart",
      cart,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error removing product",
    });
  }
});

export default router;
