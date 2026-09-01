import mongoose from "mongoose";
import Product from "./models/Product.js";
import User from "./models/User.js";
import Cart from "./models/Cart.js";
import connectDB from "./config/db.js";
import dotenv from "dotenv";

dotenv.config();

const products = [
  {
    name: "Chicken Shawarma",
    description:
      "Delicious Filipino-style shawarma with creamy garlic sauce wrapped in soft pita bread.",
    image:
      "https://images.unsplash.com/photo-1529006557810-274b9b2fc783?w=400&q=80",
    price: 120,
    rating: 4.5,
    stock: 25,
    category: "ready-to-eat",
    tags: ["Street Food", "Davao", "Best Seller"],
  },
  {
    name: "Beef Shawarma",
    description:
      "Juicy grilled beef shawarma packed with fresh vegetables and special sauce.",
    image:
      "https://images.unsplash.com/photo-1550547660-d9450f859349?w=400&q=80",
    price: 140,
    rating: 4.6,
    stock: 18,
    category: "ready-to-eat",
    tags: ["Street Food", "Beef", "Popular"],
  },
  {
    name: "Pork Shawarma",
    description:
      "Savory pork shawarma with creamy sauce and crunchy toppings.",
    image:
      "https://images.unsplash.com/photo-1529042410759-befb1204b468?w=400&q=80",
    price: 130,
    rating: 4.4,
    stock: 15,
    category: "ready-to-eat",
    tags: ["Street Food", "Pork", "Best Seller"],
  },
  {
    name: "Chicken Kebab Wrap",
    description: "Grilled chicken kebab wrapped with fresh crunchy vegetables.",
    image:
      "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&q=80",
    price: 125,
    rating: 4.3,
    stock: 20,
    category: "ready-to-eat",
    tags: ["Grilled", "Chicken", "Healthy"],
  },
  {
    name: "Falafel Shawarma",
    description: "Crispy falafel wrap with creamy tahini sauce, a vegetarian favorite.",
    image:
      "https://images.unsplash.com/photo-1541696432-82c6da8ce7bf?w=400&q=80",
    price: 110,
    rating: 4.2,
    stock: 22,
    category: "ready-to-eat",
    tags: ["Vegetarian", "Healthy", "Street Food"],
  },
  {
    name: "Siomai (12 pcs)",
    description: "Steamed pork dumplings served with soy sauce, calamansi and spicy dip.",
    image:
      "https://images.unsplash.com/photo-1541014741259-de529411b96a?w=400&q=80",
    price: 45,
    rating: 4.7,
    stock: 40,
    category: "ready-to-eat",
    tags: ["Dumpling", "Best Seller", "Snack"],
  },
  {
    name: "Carbonara Pasta",
    description: "Creamy Filipino-style carbonara with bacon bits and cheese.",
    image:
      "https://images.unsplash.com/photo-1612874742237-6526221588e3?w=400&q=80",
    price: 95,
    rating: 4.5,
    stock: 12,
    category: "ready-to-eat",
    tags: ["Pasta", "Comfort Food"],
  },
  {
    name: "Coke in Can (330ml)",
    description: "Chilled Coca-Cola soda in a 330ml can.",
    image:
      "https://images.unsplash.com/photo-1581006852262-e4307cf6283a?w=400&q=80",
    price: 55,
    rating: 4.8,
    stock: 60,
    category: "drink",
    tags: ["Soda", "Cold Drink", "Best Seller"],
  },
  {
    name: "Mineral Water (500ml)",
    description: "Refreshing purified drinking water.",
    image:
      "https://images.unsplash.com/photo-1560023907-5f3390ea926a?w=400&q=80",
    price: 20,
    rating: 4.6,
    stock: 80,
    category: "drink",
    tags: ["Water", "Hydration"],
  },
  {
    name: "Iced Coffee Latte",
    description: "Smooth iced coffee latte brewed fresh and poured over ice.",
    image:
      "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400&q=80",
    price: 85,
    rating: 4.4,
    stock: 30,
    category: "drink",
    tags: ["Coffee", "Iced", "Energy"],
  },
  {
    name: "Orange Juice",
    description: "Fresh and tangy orange juice in a handy bottle.",
    image:
      "https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=400&q=80",
    price: 75,
    rating: 4.3,
    stock: 25,
    category: "drink",
    tags: ["Juice", "Vitamin C"],
  },
  {
    name: "Barbeque Chips",
    description: "Crunchy potato chips with smoky barbeque flavor.",
    image:
      "https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=400&q=80",
    price: 35,
    rating: 4.5,
    stock: 55,
    category: "snacks",
    tags: ["Chips", "Savory", "Popular"],
  },
  {
    name: "Chocolate Bar",
    description: "Smooth milk chocolate bar that melts in your mouth.",
    image:
      "https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=400&q=80",
    price: 40,
    rating: 4.7,
    stock: 65,
    category: "snacks",
    tags: ["Chocolate", "Sweet"],
  },
  {
    name: "Potato Fries",
    description: "Crispy golden fries served fresh from the fryer.",
    image:
      "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400&q=80",
    price: 60,
    rating: 4.4,
    stock: 28,
    category: "snacks",
    tags: ["Fries", "Hot", "Best Seller"],
  },
  {
    name: "Hand Sanitizer (60ml)",
    description: "Alcohol-based hand sanitizer that kills 99.9% of germs.",
    image:
      "https://images.unsplash.com/photo-1584483766114-2cea6facdf57?w=400&q=80",
    price: 90,
    rating: 4.6,
    stock: 45,
    category: "personal-care",
    tags: ["Sanitizer", "Hygiene"],
  },
  {
    name: "Toothbrush (2 pcs)",
    description: "Soft-bristle toothbrush for gentle daily cleaning.",
    image:
      "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=400&q=80",
    price: 70,
    rating: 4.3,
    stock: 38,
    category: "personal-care",
    tags: ["Dental", "Oral Care"],
  },
  {
    name: "Shampoo Sachet",
    description: "Herbal shampoo sachet for shiny, healthy hair.",
    image:
      "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&q=80",
    price: 15,
    rating: 4.2,
    stock: 100,
    category: "personal-care",
    tags: ["Hair Care", "Sachet"],
  },
  {
    name: "Dishwashing Liquid",
    description: "Powerful dishwashing liquid that cuts through grease.",
    image:
      "https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=400&q=80",
    price: 50,
    rating: 4.4,
    stock: 48,
    category: "household",
    tags: ["Cleaning", "Kitchen"],
  },
  {
    name: "Detergent Powder",
    description: "Laundry detergent powder that leaves clothes fresh and clean.",
    image:
      "https://images.unsplash.com/photo-1610557892470-55d9e80c0bce?w=400&q=80",
    price: 65,
    rating: 4.5,
    stock: 50,
    category: "household",
    tags: ["Laundry", "Cleaning"],
  },
  {
    name: "Trash Bags (Large)",
    description: "Durable large trash bags, perfect for household waste.",
    image:
      "https://images.unsplash.com/photo-1615875889528-4e2694370b6d?w=400&q=80",
    price: 42,
    rating: 4.1,
    stock: 70,
    category: "household",
    tags: ["Household", "Garbage"],
  },
];

const seedIfEmpty = async () => {
  const productCount = await Product.countDocuments();
  if (productCount === 0) {
    const seeded = products.map((p) => ({
      ...p,
      cost: Math.round(p.price * 0.55),
      salePrice: null,
    }));
    await Product.insertMany(seeded);
    console.log("Seeded products");
  }

  const adminExists = await User.findOne({ email: "admin@7eleven.com" });
  if (!adminExists) {
    await User.create({
      name: "Admin",
      email: "admin@7eleven.com",
      password: "admin123456",
      role: "admin",
    });
    console.log("Seeded admin user");
  }

  const demoExists = await User.findOne({ email: "Jamess@hemom.com" });
  if (!demoExists) {
    const demo = await User.create({
      name: "James Hemom",
      email: "Jamess@hemom.com",
      password: "12345678",
      address: "Blk 5 Lot 3, Rizal Street, Apopong, Davao City, 8000",
    });
    await Cart.create({ user: demo._id, items: [] });
    console.log("Seeded demo user");
  }
};

const run = async () => {
  try {
    await connectDB();
    await seedIfEmpty();
    console.log("Seeding complete");
  } catch (error) {
    console.error("Seeding failed:", error.message);
  } finally {
    mongoose.connection.close();
  }
};

if (process.argv[1] && process.argv[1].endsWith("seed.js")) {
  run();
}

export { seedIfEmpty };
