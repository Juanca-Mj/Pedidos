import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  role: { type: String, enum: ["TENDERO", "PLATAFORMA", "PROVEEDOR"], required: true },
  name: { type: String, required: true },
  contact: { type: String, required: true },
  store_id: { type: mongoose.Schema.Types.ObjectId, ref: "Store" },
  provider_id: { type: mongoose.Schema.Types.ObjectId }, // referenciarías a User PROVEEDOR o a otra coll si tuvieras
  created_at: { type: Date, default: Date.now }
});

export default mongoose.model("User", userSchema);
