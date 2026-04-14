const Order = require("../model/orderModel");
const Product = require("../model/productModel");
const User = require("../model/authModel");

// POST /api/order/place
const placeOrder = async (req, res) => {
  try {
    const { items, paymentMethod, paymentDetails, shippingAddress, note } = req.body;

    if (!items || !items.length || !paymentMethod || !shippingAddress) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    let totalPrice = 0;
    const orderItems = [];

    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product) return res.status(404).json({ message: `Product not found: ${item.productId}` });
      if (!product.isActive) return res.status(400).json({ message: `Product not available: ${product.name}` });

      const qty = item.quantity || 1;
      const price = product.discountPrice || product.price;
      totalPrice += price * qty;

      orderItems.push({
        product: product._id,
        productName: product.name,
        quantity: qty,
        color: item.color || "Default",
        price,
      });
    }

    // Mask card details - store only last 4 digits
    let safePayment = {};
    if (paymentMethod === "card" && paymentDetails) {
      safePayment = {
        cardHolder: paymentDetails.cardHolder || "",
        lastFour: paymentDetails.cardNumber ? paymentDetails.cardNumber.slice(-4) : "****",
        expiry: paymentDetails.expiry || "",
      };
    }

    const order = await Order.create({
      user: req.user._id,
      items: orderItems,
      paymentMethod,
      paymentDetails: safePayment,
      shippingAddress,
      totalPrice,
      note: note || "",
    });

    // Clear user cart after order
    await User.findByIdAndUpdate(req.user._id, { cart: [] });

    const populated = await Order.findById(order._id).populate("items.product", "name price brand imageUrl");

    res.status(201).json({ message: "Order placed successfully", success: true, order: populated });
  } catch (err) {
    res.status(500).json({ message: "Order failed", error: err.message });
  }
};

// GET /api/order/all  (admin)
const getAllOrders = async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    let query = {};
    if (status) query.status = status;

    const skip = (Number(page) - 1) * Number(limit);
    const total = await Order.countDocuments(query);
    const orders = await Order.find(query)
      .populate("user", "name email phone")
      .populate("items.product", "name price brand imageUrl")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    res.status(200).json({ success: true, orders, total });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch orders", error: err.message });
  }
};

// GET /api/order/my
const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate("items.product", "name price brand imageUrl")
      .sort({ createdAt: -1 });
    res.status(200).json({ success: true, orders });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch orders", error: err.message });
  }
};

// PUT /api/order/:id/status  (admin)
const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ["pending", "confirmed", "processing", "shipped", "delivered", "cancelled"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const order = await Order.findByIdAndUpdate(id, { status }, { new: true })
      .populate("user", "name email")
      .populate("items.product", "name");

    if (!order) return res.status(404).json({ message: "Order not found" });
    res.status(200).json({ message: "Order status updated", success: true, order });
  } catch (err) {
    res.status(500).json({ message: "Status update failed", error: err.message });
  }
};

// DELETE /api/order/:id  (admin)
const deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findByIdAndDelete(id);
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.status(200).json({ success: true, message: "Order deleted" });
  } catch (err) {
    res.status(500).json({ message: "Delete failed", error: err.message });
  }
};

// GET /api/order/stats  (admin)
const getOrderStats = async (req, res) => {
  try {
    const total = await Order.countDocuments();
    const revenue = await Order.aggregate([
      { $match: { status: { $ne: "cancelled" } } },
      { $group: { _id: null, total: { $sum: "$totalPrice" } } },
    ]);
    const byStatus = await Order.aggregate([{ $group: { _id: "$status", count: { $sum: 1 } } }]);

    res.status(200).json({
      success: true,
      stats: {
        total,
        revenue: revenue[0]?.total || 0,
        byStatus: byStatus.reduce((acc, s) => ({ ...acc, [s._id]: s.count }), {}),
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch stats", error: err.message });
  }
};

module.exports = { placeOrder, getAllOrders, getMyOrders, updateOrderStatus, deleteOrder, getOrderStats };
