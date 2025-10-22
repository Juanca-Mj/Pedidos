import Zone from "../models/Zone.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// GET /api/zones
export const getZones = asyncHandler(async (req, res) => {
  const zones = await Zone.find().sort({ name: 1 });
  res.json(zones);
});

// POST /api/zones
export const createZone = asyncHandler(async (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ error: "Debe indicar un nombre de zona" });

  const exists = await Zone.findOne({ name });
  if (exists) return res.status(409).json({ error: "La zona ya existe" });

  const zone = await Zone.create({ name });
  res.status(201).json(zone);
});

// PUT /api/zones/:id
export const updateZone = asyncHandler(async (req, res) => {
  const { name } = req.body;
  const zone = await Zone.findByIdAndUpdate(req.params.id, { name }, { new: true });
  if (!zone) return res.status(404).json({ error: "Zona no encontrada" });
  res.json(zone);
});

// DELETE /api/zones/:id
export const deleteZone = asyncHandler(async (req, res) => {
  const zone = await Zone.findByIdAndDelete(req.params.id);
  if (!zone) return res.status(404).json({ error: "Zona no encontrada" });
  res.json({ message: "Zona eliminada correctamente" });
});
