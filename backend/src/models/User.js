import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
  role: { 
    type: String, 
    enum: ["TENDERO", "PLATAFORMA", "PROVEEDOR"], 
    required: true 
  },

  name: { type: String, required: true },
  contact: { type: String, required: true },

  // 🔹 Email y password para autenticación
  email: {
    type: String,
    lowercase: true,
    trim: true,
    unique: true,
    sparse: true, // permite documentos sin email (por compatibilidad vieja)
  },
  password: {
    type: String,
    select: false, // se devuelve sólo si se pide explícitamente
  },

  // 🔹 Si es tendero, puede estar vinculado a una tienda
  store_id: { type: mongoose.Schema.Types.ObjectId, ref: "Store" },

  // 🔹 Si es proveedor, puede tener múltiples zonas asignadas
  zones: [{ type: String }],  // Ejemplo: ["Zona Norte", "Zona Centro"]

  // 🔹 Estado de disponibilidad (true = libre / false = ocupado)
  available: { type: Boolean, default: true },

  created_at: { type: Date, default: Date.now }
});

// ------------------------------------------------------------
// 🔐 Encripta el password automáticamente al crear/modificar
// ------------------------------------------------------------
userSchema.pre("save", async function (next) {
  if (!this.isModified("password") || !this.password) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// ------------------------------------------------------------
// 🔐 Método para validar contraseñas en login
// ------------------------------------------------------------
userSchema.methods.comparePassword = async function (plain) {
  if (!this.password) return false;
  return bcrypt.compare(plain, this.password);
};

export default mongoose.model("User", userSchema);
