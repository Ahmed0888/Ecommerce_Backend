const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const verifyAdmin = require("../middleware/verifyAdmin");
const {
  Signup, Login, Logout, getProfile, updateProfile,
  getAllUsers, updateUserRole, deleteUser,
} = require("../Controllers/authController");

router.post("/signup", Signup);
router.post("/login", Login);
router.post("/logout", Logout);

router.get("/profile", auth, getProfile);
router.put("/profile", auth, updateProfile);

// Admin routes
router.get("/users", auth, verifyAdmin, getAllUsers);
router.put("/users/:id/role", auth, verifyAdmin, updateUserRole);
router.delete("/users/:id", auth, verifyAdmin, deleteUser);

module.exports = router;
