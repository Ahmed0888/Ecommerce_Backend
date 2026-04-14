const mongoose = require("mongoose");

const cardSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "finalusers", required: true },
    cardHolder: { type: String, required: true },
    lastFour: { type: String, required: true, maxlength: 4 },
    expiry: { type: String, required: true },
    cardType: { type: String, default: "Visa" },
    isDefault: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Card = mongoose.model("Card", cardSchema);
module.exports = Card;
