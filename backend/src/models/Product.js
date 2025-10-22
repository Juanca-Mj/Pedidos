import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  sku: { type: String, required: true, unique: true },
  price: { type: Number, required: true },
  unit: { type: String },
  active: { type: Boolean, default: true },
  stock: { type: Number, default: 0 }, // 🔹 Stock disponible
  created_by_role: { type: String },
  created_at: { type: Date, default: Date.now },
});

export default mongoose.model("Product", productSchema);
