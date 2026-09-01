import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
    },
    description: {
      type: String,
      default: "",
    },
    image: {
      type: String,
      default: "",
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: 0,
    },
    cost: {
      type: Number,
      default: 0,
      min: 0,
    },
    salePrice: {
      type: Number,
      default: null,
      min: 0,
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    stock: {
      type: Number,
      default: 0,
      min: 0,
    },
    category: {
      type: String,
      default: "all",
      trim: true,
    },
    tags: {
      type: [String],
      default: [],
    },
    variants: {
      type: [
        {
          name: String,
          options: [String],
          price: Number,
          stock: Number,
          _id: false,
        },
      ],
      default: [],
    },
  },
  { timestamps: true }
);

productSchema.index({ name: "text", description: "text", tags: "text" });

const Product = mongoose.model("Product", productSchema);

export default Product;
