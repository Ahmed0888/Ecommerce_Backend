const Card = require("../model/cardModel");

// GET /api/card/my
const getMyCards = async (req, res) => {
  try {
    const cards = await Card.find({ user: req.user._id }).sort({ isDefault: -1, createdAt: -1 });
    res.status(200).json({ success: true, cards });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch cards", error: err.message });
  }
};

// POST /api/card/add
const addCard = async (req, res) => {
  try {
    const { cardHolder, cardNumber, expiry, cardType, isDefault } = req.body;
    if (!cardHolder || !cardNumber || !expiry) {
      return res.status(400).json({ message: "Please fill all card fields" });
    }

    const lastFour = cardNumber.replace(/\s/g, "").slice(-4);

    if (isDefault) {
      await Card.updateMany({ user: req.user._id }, { isDefault: false });
    }

    const card = await Card.create({
      user: req.user._id,
      cardHolder,
      lastFour,
      expiry,
      cardType: cardType || "Visa",
      isDefault: isDefault || false,
    });

    res.status(201).json({ success: true, card, message: "Card saved" });
  } catch (err) {
    res.status(500).json({ message: "Failed to save card", error: err.message });
  }
};

// PUT /api/card/:id
const updateCard = async (req, res) => {
  try {
    const { id } = req.params;
    const { cardHolder, expiry, cardType, isDefault } = req.body;

    if (isDefault) {
      await Card.updateMany({ user: req.user._id }, { isDefault: false });
    }

    const card = await Card.findOneAndUpdate(
      { _id: id, user: req.user._id },
      { cardHolder, expiry, cardType, isDefault },
      { new: true }
    );
    if (!card) return res.status(404).json({ message: "Card not found" });

    res.status(200).json({ success: true, card });
  } catch (err) {
    res.status(500).json({ message: "Failed to update card", error: err.message });
  }
};

// DELETE /api/card/:id
const deleteCard = async (req, res) => {
  try {
    const { id } = req.params;
    const card = await Card.findOneAndDelete({ _id: id, user: req.user._id });
    if (!card) return res.status(404).json({ message: "Card not found" });
    res.status(200).json({ success: true, message: "Card removed" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete card", error: err.message });
  }
};

// Admin: GET /api/card/all
const getAllCards = async (req, res) => {
  try {
    const cards = await Card.find().populate("user", "name email").sort({ createdAt: -1 });
    res.status(200).json({ success: true, cards });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch cards", error: err.message });
  }
};

module.exports = { getMyCards, addCard, updateCard, deleteCard, getAllCards };
