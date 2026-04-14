const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const verifyAdmin = require("../middleware/verifyAdmin");
const {
  getProducts, getProductById, getCategories,
  addProduct, updateProduct, deleteProduct,
} = require("../Controllers/productController");

router.get("/", getProducts);
router.get("/categories", getCategories);
router.get("/:id", getProductById);

router.post("/", auth, verifyAdmin, addProduct);
router.put("/:id", auth, verifyAdmin, updateProduct);
router.delete("/:id", auth, verifyAdmin, deleteProduct);

module.exports = router;
