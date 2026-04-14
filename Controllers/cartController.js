const User = require("../model/authModel");
const Product = require("../model/productModel");

// GET /api/cart
const getCart = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate("cart.product", "name price discountPrice brand imageUrl isActive stock");
    res.status(200).json({ success: true, cart: user.cart });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch cart", error: err.message });
  }
};

// POST /api/cart/add
const addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1, color = "Default" } = req.body;
    if (!productId) return res.status(400).json({ message: "Product ID required" });

    const product = await Product.findById(productId);
    if (!product || !product.isActive) return res.status(404).json({ message: "Product not available" });

    const user = await User.findById(req.user._id);
    const existingIdx = user.cart.findIndex(
      (item) => item.product.toString() === productId && item.color === color
    );

    if (existingIdx >= 0) {
      user.cart[existingIdx].quantity += quantity;
    } else {
      user.cart.push({ product: productId, quantity, color });
    }

    await user.save();
    const updated = await User.findById(req.user._id).populate("cart.product", "name price discountPrice brand imageUrl isActive stock");
    res.status(200).json({ success: true, cart: updated.cart, message: "Added to cart" });
  } catch (err) {
    res.status(500).json({ message: "Failed to add to cart", error: err.message });
  }
};

// PUT /api/cart/:itemId
const updateCartItem = async (req, res) => {
  try {
    const { itemId } = req.params;
    const { quantity } = req.body;

    const user = await User.findById(req.user._id);
    const item = user.cart.id(itemId);
    if (!item) return res.status(404).json({ message: "Cart item not found" });

    if (quantity <= 0) {
      user.cart.pull(itemId);
    } else {
      item.quantity = quantity;
    }

    await user.save();
    const updated = await User.findById(req.user._id).populate("cart.product", "name price discountPrice brand imageUrl isActive stock");
    res.status(200).json({ success: true, cart: updated.cart });
  } catch (err) {
    res.status(500).json({ message: "Failed to update cart", error: err.message });
  }
};

// DELETE /api/cart/:itemId
const removeFromCart = async (req, res) => {
  try {
    const { itemId } = req.params;
    const user = await User.findById(req.user._id);
    user.cart.pull(itemId);
    await user.save();
    const updated = await User.findById(req.user._id).populate("cart.product", "name price discountPrice brand imageUrl isActive stock");
    res.status(200).json({ success: true, cart: updated.cart, message: "Removed from cart" });
  } catch (err) {
    res.status(500).json({ message: "Failed to remove from cart", error: err.message });
  }
};

// DELETE /api/cart/clear
const clearCart = async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.user._id, { cart: [] });
    res.status(200).json({ success: true, cart: [], message: "Cart cleared" });
  } catch (err) {
    res.status(500).json({ message: "Failed to clear cart", error: err.message });
  }
};

module.exports = { getCart, addToCart, updateCartItem, removeFromCart, clearCart };
