const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const { getCart, addToCart, updateCartItem, removeFromCart, clearCart } = require("../Controllers/cartController");

router.get("/", auth, getCart);
router.post("/add", auth, addToCart);
router.put("/:itemId", auth, updateCartItem);
router.delete("/clear", auth, clearCart);
router.delete("/:itemId", auth, removeFromCart);

module.exports = router;
