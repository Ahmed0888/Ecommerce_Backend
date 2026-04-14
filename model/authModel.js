const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    phone: { type: String, default: "" },
    address: {
      street: { type: String, default: "" },
      city: { type: String, default: "" },
    },
    cart: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, ref: "Products" },
        quantity: { type: Number, default: 1 },
        color: { type: String, default: "Default" },
      },
    ],
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const User = mongoose.model("finalusers", userSchema);
module.exports = User;
