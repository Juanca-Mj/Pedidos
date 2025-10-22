import mongoose from "mongoose";

const zoneSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true, // 🔹 Evita duplicados
    trim: true
  },
  created_at: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model("Zone", zoneSchema);
