import Cart from "../models/Cart.js";
import Product from "../models/Product.js";

const getOrCreateCart = async (userId) => {
  let cart = await Cart.findOne({ user: userId });
  if (!cart) {
    cart = await Cart.create({ user: userId, items: [] });
  }
  return cart;
};

const toResponse = async (cart) => {
  const populated = await cart.populate("items.product");
  return populated.items
    .filter((i) => i.product)
    .map((i) => ({
      id: i.product._id,
      name: i.product.name,
      description: i.product.description,
      image: i.product.image,
      price: i.product.price,
      rating: i.product.rating,
      stock: i.product.stock,
      category: i.product.category,
      tags: i.product.tags || [],
      quantity: i.quantity,
    }));
};

export const getCart = async (req, res) => {
  try {
    const cart = await getOrCreateCart(req.user._id);
    const items = await toResponse(cart);
    const subtotal = items.reduce(
      (sum, i) => sum + i.price * i.quantity,
      0
    );
    res.json({ items, subtotal, count: items.length });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const cart = await getOrCreateCart(req.user._id);
    const existing = cart.items.find(
      (i) => i.product.toString() === String(productId)
    );

    if (existing) {
      existing.quantity += Number(quantity);
    } else {
      cart.items.push({ product: productId, quantity: Number(quantity) });
    }

    await cart.save();
    const items = await toResponse(cart);
    const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
    res.status(201).json({ items, subtotal, count: items.length });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateCartQuantity = async (req, res) => {
  try {
    const { productId } = req.params;
    const { quantity } = req.body;

    const cart = await getOrCreateCart(req.user._id);
    const item = cart.items.find(
      (i) => i.product.toString() === String(productId)
    );

    if (!item) {
      return res.status(404).json({ message: "Item not in cart" });
    }

    item.quantity = Number(quantity);
    if (item.quantity < 1) item.quantity = 1;

    await cart.save();
    const items = await toResponse(cart);
    const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
    res.json({ items, subtotal, count: items.length });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params;

    const cart = await getOrCreateCart(req.user._id);
    cart.items = cart.items.filter(
      (i) => i.product.toString() !== String(productId)
    );

    await cart.save();
    const items = await toResponse(cart);
    const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
    res.json({ items, subtotal, count: items.length });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const clearCart = async (req, res) => {
  try {
    const cart = await getOrCreateCart(req.user._id);
    cart.items = [];
    await cart.save();
    res.json({ items: [], subtotal: 0, count: 0 });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
