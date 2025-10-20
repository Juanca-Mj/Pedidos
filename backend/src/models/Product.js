import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  sku: { type: String, required: true, unique: true },
  price: { type: Number, required: true },
  unit: { type: String },
  created_by_role: { type: String, enum: ["PLATAFORMA"], required: true },
  active: { type: Boolean, default: true },
  created_at: { type: Date, default: Date.now }
});

export default mongoose.model("Product", productSchema);
