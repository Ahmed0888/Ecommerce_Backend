const express = require("express");
const cors = require("cors");
const Db = require("./Db/dbconnection");
const authRoute = require("./Router/authRouter");
const productRoutes = require("./Router/productRoutes");
const orderRoutes = require("./Router/orderRoutes");
const cardRoutes = require("./Router/cardRoutes");
const cartRoutes = require("./Router/cartRoutes");
require("dotenv").config();
const cookieParser = require("cookie-parser");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

Db();

app.use("/api/auth", authRoute);
app.use("/api/product", productRoutes);
app.use("/api/order", orderRoutes);
app.use("/api/card", cardRoutes);
app.use("/api/cart", cartRoutes);

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Internal Server Error", error: err.message });
});

app.listen(PORT, () => {
  console.log(`✅ Server running on port: ${PORT}`);
});
