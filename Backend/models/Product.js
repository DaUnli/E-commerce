import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please enter product name"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Please enter product description"],
    },
    price: {
      type: Number,
      required: [true, "Please enter product price"],
      default: 0,
      min: [0, "Price cannot be negative"],
    },
    stock: {
      type: Number,
      required: [true, "Please enter product stock"],
      default: 0,
      min: [0, "Stock cannot be negative"],
    },
    category: {
      type: String,
      required: [true, "Please select category"],
    },
    images: [
      {
        public_id: {
          type: String,
          required: true,
        },
        url: {
          type: String,
          required: true,
        },
      },
    ],

    ratings: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },

    numOfReviews: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Product", productSchema);
