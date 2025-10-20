import Order from "../models/Order.js";
import Store from "../models/Store.js";
import Product from "../models/Product.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// Helper: sumar horas
const plusHours = (date, h) => new Date(date.getTime() + h * 3600000);

// GET /api/orders   (filtros opcionales: ?zone=...&store=...&tendero=...)
export const getOrders = asyncHandler(async (req, res) => {
  const { zone, store, tendero } = req.query;
  const q = {};
  if (zone) q.zone = zone;
  if (store) q.store_id = store;
  if (tendero) q.tendero_user_id = tendero;

  const orders = await Order.find(q)
    .populate("tendero_user_id", "name role")
    .populate("store_id", "name zone")
    .sort({ created_at: -1 });

  res.json(orders);
});

// POST /api/orders  (TENDERO crea pedido, solo selecciona de catálogo)
export const createOrder = asyncHandler(async (req, res) => {
  const { tendero_user_id, store_id, items } = req.body;

  if (!tendero_user_id || !store_id || !items?.length)
    return res.status(400).json({ error: "Datos incompletos" });

  // 1) Validar tienda y obtener zona
  const store = await Store.findById(store_id);
  if (!store) return res.status(404).json({ error: "Tienda no encontrada" });

  const zone = store.zone;

  // 2) Un pedido ACTIVO por tendero
  const ACTIVE = ["pendiente","en_consolidacion","en_asignacion","en_despacho"];
  const existsActive = await Order.exists({ tendero_user_id, status: { $in: ACTIVE } });
  if (existsActive)
    return res.status(409).json({ error: "Ya existe un pedido activo para este tendero" });

  // 3) Validar productos del catálogo (no crear nuevos)
  const productIds = items.map(i => i.product_id);
  const products = await Product.find({ _id: { $in: productIds }, active: true });
  if (products.length !== items.length)
    return res.status(400).json({ error: "Uno o más productos no existen o no están activos" });

  // 4) Normalizar items con datos del catálogo
  const normalized = items.map(i => {
    const p = products.find(pp => String(pp._id) === String(i.product_id));
    return {
      product_id: p._id,
      product_name: p.name,
      sku: p.sku,
      quantity: i.quantity,
      price: p.price
    };
  });

  // 5) Crear pedido con deadline 72h
  const now = new Date();
  const order = await Order.create({
    tendero_user_id,
    store_id,
    zone,
    status: "pendiente",
    items: normalized,
    received: false,
    created_at: now,
    deadline_at: plusHours(now, 72),
    consolidation_id: null
  });

  res.status(201).json(order);
});

// POST /api/orders/:id/received  (TENDERO marca recibido)
export const markReceived = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) return res.status(404).json({ error: "Pedido no encontrado" });

  // Se recomienda permitir recibido solo cuando el proveedor marcó ENTREGADO
  if (order.status !== "entregado")
    return res.status(400).json({ error: "El pedido aún no está en estado 'entregado'" });

  order.received = true;
  order.received_at = new Date();
  await order.save();

  res.json({ ok: true, order });
});
