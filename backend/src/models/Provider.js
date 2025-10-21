import mongoose from "mongoose";

const providerSchema = new mongoose.Schema({
  company_name: { type: String, required: true },
  contact: { type: String },
  zones: [{ type: String }],
  created_at: { type: Date, default: Date.now },
});

export default mongoose.model("Provider", providerSchema);
