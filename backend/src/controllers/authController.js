import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log("🟢 Email recibido:", email);
    console.log("🟢 Password recibido:", password);

    // Verificar si existe el usuario
    const user = await User.findOne({ email }).select("+password");
    if (!user) return res.status(401).json({ message: "Usuario no encontrado" });

    console.log("🟢 Password en BD:", user.password);

    // Comparar contraseñas
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Credenciales inválidas" });

    // Generar token JWT
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET || "clave_secreta_segura",
      { expiresIn: "8h" }
    );

    res.status(200).json({
      success: true,
      message: "Inicio de sesión exitoso",
      token,
      user: {
        _id: user._id,
        name: user.name,
        role: user.role,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("❌ Error en loginUser:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};
