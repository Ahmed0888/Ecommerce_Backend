const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "finalusers", required: true },
    items: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, ref: "Products", required: true },
        productName: { type: String },
        quantity: { type: Number, required: true, default: 1 },
        color: { type: String, default: "Default" },
        price: { type: Number },
      },
    ],
    paymentMethod: { type: String, enum: ["cod", "card"], required: true },
    paymentDetails: {
      cardHolder: { type: String },
      lastFour: { type: String },
      expiry: { type: String },
    },
    shippingAddress: {
      street: { type: String, required: true },
      city: { type: String, required: true },
      phone: { type: String, required: true },
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "processing", "shipped", "delivered", "cancelled"],
      default: "pending",
    },
    totalPrice: { type: Number, required: true },
    note: { type: String, default: "" },
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);
module.exports = Order;
