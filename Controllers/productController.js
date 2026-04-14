const Product = require("../model/productModel");

// GET /api/product/all  (public) - with search & filter
const getProducts = async (req, res) => {
  try {
    const { search, category, brand, minPrice, maxPrice, inStock, sort, page = 1, limit = 20 } = req.query;

    let query = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { brand: { $regex: search, $options: "i" } },
        { category: { $regex: search, $options: "i" } },
      ];
    }

    if (category) query.category = { $regex: category, $options: "i" };
    if (brand) query.brand = { $regex: brand, $options: "i" };
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }
    if (inStock === "true") query.stock = { $gt: 0 };

    let sortObj = { createdAt: -1 };
    if (sort === "price_asc") sortObj = { price: 1 };
    if (sort === "price_desc") sortObj = { price: -1 };
    if (sort === "name") sortObj = { name: 1 };
    if (sort === "newest") sortObj = { createdAt: -1 };

    const skip = (Number(page) - 1) * Number(limit);
    const total = await Product.countDocuments(query);
    const products = await Product.find(query).sort(sortObj).skip(skip).limit(Number(limit));

    res.status(200).json({ success: true, products, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch products", error: err.message });
  }
};

// GET /api/product/:id
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.status(200).json({ success: true, product });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch product", error: err.message });
  }
};

// GET /api/product/categories - get unique categories
const getCategories = async (req, res) => {
  try {
    const categories = await Product.distinct("category");
    res.status(200).json({ success: true, categories });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch categories", error: err.message });
  }
};

// POST /api/product/add  (admin)
const addProduct = async (req, res) => {
  try {
    const { name, description, price, discountPrice, category, brand, sku, stock, isActive, imageUrl, tags, isFeatured } = req.body;

    if (!name || !description || !price || !category || !sku) {
      return res.status(400).json({ message: "Please fill all required fields" });
    }

    const existing = await Product.findOne({ sku });
    if (existing) return res.status(409).json({ message: "SKU already exists" });

    const newProduct = await Product.create({
      name, description, price, discountPrice, category, brand, sku,
      stock: stock || 0, isActive, imageUrl, tags, isFeatured,
    });

    res.status(201).json({ message: "Product created", success: true, product: newProduct });
  } catch (err) {
    res.status(500).json({ message: "Product creation failed", error: err.message });
  }
};

// PUT /api/product/:id  (admin)
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const updated = await Product.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
    if (!updated) return res.status(404).json({ message: "Product not found" });

    res.status(200).json({ message: "Product updated", success: true, product: updated });
  } catch (err) {
    res.status(500).json({ message: "Product update failed", error: err.message });
  }
};

// DELETE /api/product/:id  (admin)
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Product.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: "Product not found" });

    res.status(200).json({ message: "Product deleted", success: true });
  } catch (err) {
    res.status(500).json({ message: "Delete failed", error: err.message });
  }
};

module.exports = { getProducts, getProductById, getCategories, addProduct, updateProduct, deleteProduct };
