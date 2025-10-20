import Store from "../models/Store.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// GET /api/stores
export const getStores = asyncHandler(async (req, res) => {
  const stores = await Store.find().populate("tendero_user_id", "name contact role");
  res.json(stores);
});

// POST /api/stores  (la crea PLATAFORMA)
export const createStore = asyncHandler(async (req, res) => {
  const store = await Store.create(req.body);
  res.status(201).json(store);
});
