import express from "express";
import {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
} from "../controllers/userController.js";
import { validateRole } from "../utils/validateRole.js";

const router = express.Router();

// 🔹 Listar usuarios (cualquier rol puede ver)
router.get("/", getUsers);

// 🔹 Crear usuario (solo PLATAFORMA puede crear desde la interfaz administrativa)
router.post("/", validateRole("PLATAFORMA"), createUser);

// 🔹 Actualizar usuario (permite edición)
router.put("/:id", updateUser);

// 🔹 Eliminar usuario
router.delete("/:id", deleteUser);

export default router;
