import express from "express";
import Product from "../models/Product.js";

const router = express.Router();

// GET /api/products/search?query=...
router.get("/search", async (req, res) => {
  try {
    const query = req.query.query?.toString().trim();

    const searchCondition = query
      ? {
          $or: [
            { name: { $regex: query, $options: "i" } },
            { category: { $regex: query, $options: "i" } },
            { description: { $regex: query, $options: "i" } },
          ],
        }
      : {};

    const products = await Product.find(searchCondition)
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error) {
    console.error("Search error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to search products",
    });
  }
});

export default router;