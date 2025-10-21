import express from "express";
import { getStores, createStore } from "../controllers/storeController.js";
import { validateRole } from "../utils/validateRole.js";

const router = express.Router();

// Obtener todas las tiendas
router.get("/", getStores);

// Crear tienda (solo plataforma, si quieres permitir también tendero, cambia el rol)
router.post("/", validateRole("PLATAFORMA"), createStore);

export default router;
