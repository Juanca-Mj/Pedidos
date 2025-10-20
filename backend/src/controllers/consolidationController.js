import Consolidation from "../models/Consolidation.js";
import Order from "../models/Order.js";
import Product from "../models/Product.js";
import Store from "../models/Store.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// Estados activos
const CONS_ACTIVE = ["en_consolidacion","en_asignacion","en_despacho"];

// GET /api/consolidations  (filtro opcional ?zone=...&status=...)
export const getConsolidations = asyncHandler(async (req, res) => {
  const { zone, status } = req.query;
  const q = {};
  if (zone) q.zone = zone;
  if (status) q.status = status;

  const cons = await Consolidation.find(q)
    .populate("provider_id", "name role")
    .sort({ created_at: -1 });

  res.json(cons);
});

// POST /api/consolidations  (PLATAFORMA) body: { zone: "Zona Norte" }
export const createConsolidation = asyncHandler(async (req, res) => {
  const { zone } = req.body;
  if (!zone) return res.status(400).json({ error: "Debe indicar 'zone'" });

  // 1) Verificar que no exista consolidación ACTIVA por zona
  const exists = await Consolidation.exists({ zone, status: { $in: CONS_ACTIVE } });
  if (exists) return res.status(409).json({ error: "Ya existe una consolidación activa para esta zona" });

  // 2) Tomar pedidos 'pendiente' de la zona y pasarlos a 'en_consolidacion'
  const pending = await Order.find({ zone, status: "pendiente" });
  if (!pending.length) return res.status(400).json({ error: "No hay pedidos pendientes para consolidar" });

  await Order.updateMany(
    { zone, status: "pendiente" },
    { $set: { status: "en_consolidacion" } }
  );

  // 3) Agrupar por producto
  const lines = [];
  for (const o of pending) {
    for (const it of o.items) {
      let line = lines.find(l => String(l.product_id) === String(it.product_id));
      if (!line) {
        line = {
          product_id: it.product_id,
          sku: it.sku,
          product_name: it.product_name,
          total_quantity: 0,
          order_refs: []
        };
        lines.push(line);
      }
      line.total_quantity += it.quantity;
      line.order_refs.push({
        order_id: o._id,
        store_id: o.store_id,
        tendero_user_id: o.tendero_user_id,
        quantity: it.quantity
      });
    }
  }

  // 4) Crear consolidación
  const cons = await Consolidation.create({
    zone,
    status: "en_consolidacion",
    provider_id: null,
    items: lines,
    tracking: [{ at: new Date(), status: "en_consolidacion", by_role: "PLATAFORMA", note: "Consolidación creada" }]
  });

  // 5) Linkear órdenes a la consolidación
  await Order.updateMany(
    { _id: { $in: pending.map(p => p._id) } },
    { $set: { consolidation_id: cons._id } }
  );

  res.status(201).json(cons);
});

// POST /api/consolidations/:id/assign-provider  (PLATAFORMA) body: { provider_user_id }
export const assignProvider = asyncHandler(async (req, res) => {
  const { provider_user_id } = req.body;
  const cons = await Consolidation.findById(req.params.id);
  if (!cons) return res.status(404).json({ error: "Consolidación no encontrada" });

  if (cons.status !== "en_consolidacion")
    return res.status(400).json({ error: "La consolidación no está en estado 'en_consolidacion'" });

  cons.provider_id = provider_user_id;
  cons.status = "en_asignacion";
  cons.tracking.push({ at: new Date(), status: "en_asignacion", by_role: "PLATAFORMA", note: "Proveedor asignado" });
  await cons.save();

  res.json(cons);
});

// POST /api/consolidations/:id/dispatch  (PROVEEDOR)
export const moveToDispatch = asyncHandler(async (req, res) => {
  const cons = await Consolidation.findById(req.params.id);
  if (!cons) return res.status(404).json({ error: "Consolidación no encontrada" });

  if (!cons.provider_id)
    return res.status(400).json({ error: "Debe estar asignado a un proveedor" });

  if (cons.status !== "en_asignacion")
    return res.status(400).json({ error: "Estado inválido. Debe estar 'en_asignacion'" });

  cons.status = "en_despacho";
  cons.dispatched_at = new Date();
  cons.tracking.push({ at: new Date(), status: "en_despacho", by_role: "PROVEEDOR", note: "Pedido consolidado despachado" });
  await cons.save();

  // Propagar a órdenes
  await Order.updateMany(
    { consolidation_id: cons._id },
    { $set: { status: "en_despacho" } }
  );

  res.json(cons);
});

// POST /api/consolidations/:id/deliver  (PROVEEDOR)
export const markDelivered = asyncHandler(async (req, res) => {
  const cons = await Consolidation.findById(req.params.id);
  if (!cons) return res.status(404).json({ error: "Consolidación no encontrada" });

  if (cons.status !== "en_despacho")
    return res.status(400).json({ error: "Estado inválido. Debe estar 'en_despacho'" });

  cons.status = "entregado";
  cons.delivered_at = new Date();
  cons.tracking.push({ at: new Date(), status: "entregado", by_role: "PROVEEDOR", note: "Consolidado entregado" });
  await cons.save();

  // Propagar a órdenes (entregado). El tendero luego puede marcar 'received' en su pedido.
  await Order.updateMany(
    { consolidation_id: cons._id },
    { $set: { status: "entregado" } }
  );

  res.json(cons);
});
