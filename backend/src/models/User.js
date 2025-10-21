import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  role: { 
    type: String, 
    enum: ["TENDERO", "PLATAFORMA", "PROVEEDOR"], 
    required: true 
  },

  name: { type: String, required: true },
  contact: { type: String, required: true },

  // 🔹 Si es tendero, puede estar vinculado a una tienda
  store_id: { type: mongoose.Schema.Types.ObjectId, ref: "Store" },

  // 🔹 Si es proveedor, puede tener múltiples zonas asignadas
  zones: [{ type: String }],  // Ejemplo: ["Zona Norte", "Zona Centro"]

  // 🔹 Estado de disponibilidad (true = libre / false = ocupado)
  available: { type: Boolean, default: true },

  created_at: { type: Date, default: Date.now }
});

export default mongoose.model("User", userSchema);
