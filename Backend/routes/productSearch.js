import express from "express";
import Product from "../models/Product.js"; // adjust path if needed

const router = express.Router();

// GET /api/products/search?query=...
router.get("/", async (req, res) => {
  try {
    const query = req.query.query ? String(req.query.query).trim() : "";

    // Build search condition
    let searchCondition = {};
    if (query.length > 0) {
      searchCondition = {
        $or: [
          { name: { $regex: query, $options: "i" } },
          { category: { $regex: query, $options: "i" } },
          { description: { $regex: query, $options: "i" } },
        ],
      };
    }

    const products = await Product.find(searchCondition).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error) {
    console.error("Product search error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to search products",
    });
  }
});

export default router;