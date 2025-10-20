import mongoose from "mongoose";

const itemSchema = new mongoose.Schema({
  product_id: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
  product_name: { type: String, required: true },
  sku: { type: String, required: true },
  quantity: { type: Number, required: true, min: 1 },
  price: { type: Number, required: true },
});

const orderSchema = new mongoose.Schema({
  tendero_user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  store_id: { type: mongoose.Schema.Types.ObjectId, ref: "Store", required: true },
  zone: { type: String, required: true },
  status: { 
    type: String,
    enum: ["pendiente","en_consolidacion","en_asignacion","en_despacho","entregado","cancelado"],
    default: "pendiente"
  },
  items: { type: [itemSchema], required: true },
  received: { type: Boolean, default: false },
  received_at: { type: Date },
  created_at: { type: Date, default: Date.now },
  deadline_at: { type: Date, required: true },
  consolidation_id: { type: mongoose.Schema.Types.ObjectId, ref: "Consolidation" }
});

export default mongoose.model("Order", orderSchema);
