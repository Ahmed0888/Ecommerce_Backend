const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const verifyAdmin = require("../middleware/verifyAdmin");
const {
  placeOrder, getAllOrders, getMyOrders,
  updateOrderStatus, deleteOrder, getOrderStats,
} = require("../Controllers/orderController");

router.post("/place", auth, placeOrder);
router.get("/my", auth, getMyOrders);

// Admin
router.get("/all", auth, verifyAdmin, getAllOrders);
router.get("/stats", auth, verifyAdmin, getOrderStats);
router.put("/:id/status", auth, verifyAdmin, updateOrderStatus);
router.delete("/:id", auth, verifyAdmin, deleteOrder);

module.exports = router;
