import Product from "../models/Product.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// =====================================================
// GET /api/products  (lista productos activos)
// =====================================================
export const getProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({ active: true }).sort({ name: 1 });
  res.json(products);
});

// =====================================================
// POST /api/products  (solo PLATAFORMA)
// body: { name, sku, price, unit, stock }
// =====================================================
export const createProduct = asyncHandler(async (req, res) => {
  const { name, sku, price, unit, stock } = req.body;

  // Validaciones básicas
  if (!name || !sku || price == null) {
    return res.status(400).json({ error: "Faltan datos obligatorios" });
  }

  const product = await Product.create({
    name,
    sku,
    price,
    unit,
    stock: Number(stock) || 0, // stock inicial (si no se envía, 0)
    created_by_role: "PLATAFORMA",
    active: true,
  });

  res.status(201).json(product);
});

// =====================================================
// PUT /api/products/:id/toggle
// (activar/desactivar producto) — solo PLATAFORMA
// =====================================================
export const toggleProduct = asyncHandler(async (req, res) => {
  const p = await Product.findById(req.params.id);
  if (!p) return res.status(404).json({ error: "Producto no encontrado" });

  p.active = !p.active;
  await p.save();

  res.json(p);
});

// =====================================================
// PUT /api/products/:id/stock
// (actualiza el stock de forma ABSOLUTA) — solo PLATAFORMA
// body: { stock: number }
// =====================================================
export const updateStock = asyncHandler(async (req, res) => {
  const { stock } = req.body;
  const p = await Product.findById(req.params.id);
  if (!p) return res.status(404).json({ error: "Producto no encontrado" });

  const value = Number(stock);
  if (Number.isNaN(value) || value < 0) {
    return res.status(400).json({ error: "Valor de stock inválido" });
  }

  p.stock = value; // set absoluto
  await p.save();
  res.json(p);
});

// =====================================================
// PUT /api/products/:id/stock/add
// (REABASTECER: suma al stock actual) — solo PLATAFORMA
// body: { amount: number }
// =====================================================
export const addStock = asyncHandler(async (req, res) => {
  const { amount } = req.body;
  const p = await Product.findById(req.params.id);
  if (!p) return res.status(404).json({ error: "Producto no encontrado" });

  const inc = Number(amount);
  if (Number.isNaN(inc) || inc <= 0) {
    return res.status(400).json({ error: "Cantidad a agregar inválida" });
  }

  p.stock = Math.max(0, (p.stock || 0) + inc); // nunca negativo
  await p.save();

  res.json({
    message: `Stock aumentado en +${inc} unidades`,
    newStock: p.stock,
    product: p,
  });
});
