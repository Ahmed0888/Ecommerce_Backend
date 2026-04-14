const { Schema, model } = require("mongoose");

const ProductSchema = new Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 200 },
    description: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    discountPrice: { type: Number, min: 0, default: null },
    category: { type: String, required: true, trim: true },
    brand: { type: String, trim: true, default: "" },
    sku: { type: String, unique: true, required: true },
    stock: { type: Number, required: true, min: 0, default: 0 },
    imageUrl: { type: String, default: "" },
    tags: [String],
    ratingsAverage: { type: Number, min: 0, max: 5, default: 0 },
    ratingsCount: { type: Number, default: 0 },
    isFeatured: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// Text index for search
ProductSchema.index({ name: "text", description: "text", category: "text", brand: "text" });

const ProductModel = model("Products", ProductSchema);
module.exports = ProductModel;
