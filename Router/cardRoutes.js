const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const verifyAdmin = require("../middleware/verifyAdmin");
const { getMyCards, addCard, updateCard, deleteCard, getAllCards } = require("../Controllers/cardController");

router.get("/my", auth, getMyCards);
router.post("/add", auth, addCard);
router.put("/:id", auth, updateCard);
router.delete("/:id", auth, deleteCard);

// Admin
router.get("/all", auth, verifyAdmin, getAllCards);

module.exports = router;
