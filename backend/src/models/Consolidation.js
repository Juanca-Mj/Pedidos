import mongoose from "mongoose";

const orderRefSchema = new mongoose.Schema({
  order_id: { type: mongoose.Schema.Types.ObjectId, ref: "Order", required: true },
  store_id: { type: mongoose.Schema.Types.ObjectId, ref: "Store", required: true },
  tendero_user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  quantity: { type: Number, required: true, min: 1 }
});

const consItemSchema = new mongoose.Schema({
  product_id: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
  product_name: { type: String, required: true },
  sku: { type: String, required: true },
  total_quantity: { type: Number, required: true, min: 1 },
  order_refs: { type: [orderRefSchema], default: [] }
});

const trackingSchema = new mongoose.Schema({
  at: { type: Date, default: Date.now },
  status: { type: String, required: true },
  by_role: { type: String, enum: ["PLATAFORMA","PROVEEDOR"], required: true },
  note: { type: String }
});

const consolidationSchema = new mongoose.Schema({
  zone: { type: String, required: true },
  status: { 
    type: String,
    enum: ["en_consolidacion","en_asignacion","en_despacho","entregado","cancelado"],
    default: "en_consolidacion"
  },
  provider_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  items: { type: [consItemSchema], default: [] },
  tracking: { type: [trackingSchema], default: [] },
  created_at: { type: Date, default: Date.now },
  dispatched_at: { type: Date },
  delivered_at: { type: Date }
});

export default mongoose.model("Consolidation", consolidationSchema);
