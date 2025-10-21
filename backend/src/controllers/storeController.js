import mongoose from "mongoose";
import Store from "../models/Store.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// ===============================================
// GET /api/stores
// Devuelve todas las tiendas con la información del tendero vinculado
// ===============================================
export const getStores = asyncHandler(async (req, res) => {
  const stores = await Store.find().populate("tendero_user_id", "name contact role");
  res.json(stores);
});

// ===============================================
// POST /api/stores
// Crea una nueva tienda (rol: PLATAFORMA o TENDERO)
// ===============================================
export const createStore = asyncHandler(async (req, res) => {
  try {
    const { name, zone, contact, tendero_user_id } = req.body;

    // Validación de campos mínimos
    if (!name || !zone || !contact) {
      return res.status(400).json({ error: "Faltan campos obligatorios" });
    }

    // Verificar si ya existe una tienda con ese nombre y zona
    const existing = await Store.findOne({ name, zone });
    if (existing) {
      return res.status(409).json({ error: "Ya existe una tienda con ese nombre en esta zona" });
    }

    // Crear el objeto de tienda
    const storeData = { name, zone, contact };

    // Solo agregar tendero_user_id si es válido
    if (tendero_user_id && mongoose.isValidObjectId(tendero_user_id)) {
      storeData.tendero_user_id = tendero_user_id;
    }

    // Crear tienda en base de datos
    const store = await Store.create(storeData);

    res.status(201).json(store);
  } catch (err) {
    console.error("Error al crear tienda:", err);
    res.status(500).json({ error: "Error interno al crear tienda" });
  }
});
