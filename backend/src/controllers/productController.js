import Product from "../models/Product.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// GET /api/products  (lista solo activos)
export const getProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({ active: true }).sort({ name: 1 });
  res.json(products);
});

// POST /api/products  (solo PLATAFORMA)
export const createProduct = asyncHandler(async (req, res) => {
  const { name, sku, price, unit } = req.body;
  const product = await Product.create({
    name, sku, price, unit,
    created_by_role: "PLATAFORMA",
    active: true
  });
  res.status(201).json(product);
});

// PUT /api/products/:id/toggle (activar/desactivar) — solo PLATAFORMA
export const toggleProduct = asyncHandler(async (req, res) => {
  const p = await Product.findById(req.params.id);
  if (!p) return res.status(404).json({ error: "Producto no encontrado" });
  p.active = !p.active;
  await p.save();
  res.json(p);
});
