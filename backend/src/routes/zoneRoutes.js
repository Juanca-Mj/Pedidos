import express from "express";
import {
  getZones,
  createZone,
  updateZone,
  deleteZone
} from "../controllers/zoneController.js";
import { validateRole } from "../utils/validateRole.js";

const router = express.Router();

// === Listar todas las zonas ===
router.get("/", getZones);

// === Crear nueva zona (solo PLATAFORMA) ===
router.post("/", validateRole("PLATAFORMA"), createZone);

// === Actualizar zona (solo PLATAFORMA) ===
router.put("/:id", validateRole("PLATAFORMA"), updateZone);

// === Eliminar zona (solo PLATAFORMA) ===
router.delete("/:id", validateRole("PLATAFORMA"), deleteZone);

export default router;
