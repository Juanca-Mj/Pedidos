import express from "express";
import { loginUser } from "../controllers/authController.js";

const router = express.Router();

// 🔹 Ruta de inicio de sesión
router.post("/login", loginUser);

export default router;
