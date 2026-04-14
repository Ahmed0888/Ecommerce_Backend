const mongoose = require("mongoose");
require("dotenv").config();

const Db = async () => {
  try {
    await mongoose.connect(
      `mongodb+srv://AhmedHashmi:${process.env.MONGO_URI}@cluster0.r7yo0xw.mongodb.net/?appName=Cluster0`,
    );
    console.log("✅ MongoDB Connected");
  } catch (err) {
    console.error("❌ MongoDB Connection Failed:", err.message);
    process.exit(1);
  }
};

module.exports = Db;
