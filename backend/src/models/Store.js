import mongoose from "mongoose";

const storeSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  zone: { type: String, required: true },
  contact: { type: String, required: true },
  tendero_user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  created_at: { type: Date, default: Date.now }
});

export default mongoose.model("Store", storeSchema);
