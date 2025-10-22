import Order from "../models/Order.js";
import Store from "../models/Store.js";
import Product from "../models/Product.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// Helper: sumar horas
const plusHours = (date, h) => new Date(date.getTime() + h * 3600000);

// ==============================================
// GET /api/orders   (filtros opcionales: ?zone=...&store=...&tendero=...)
// ==============================================
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

// ==============================================
// POST /api/orders  (TENDERO crea pedido)
// ==============================================
export const createOrder = asyncHandler(async (req, res) => {
  const { tendero_user_id, store_id, items } = req.body;

  console.log("🟦 [CREATE ORDER] Datos recibidos del frontend:");
  console.log("➡️ tendero_user_id:", tendero_user_id);
  console.log("➡️ store_id:", store_id);
  console.log("➡️ items:", items);

  if (!tendero_user_id || !store_id || !items?.length)
    return res.status(400).json({ error: "Datos incompletos" });

  // 1️⃣ Validar tienda y obtener zona
  const store = await Store.findById(store_id);
  if (!store) return res.status(404).json({ error: "Tienda no encontrada" });

  const zone = store.zone;
  console.log(`🏪 Tienda encontrada: ${store.name} (${zone})`);

  // 2️⃣ Un pedido ACTIVO por tienda (no por tendero)
  const ACTIVE = ["pendiente", "en_consolidacion", "en_asignacion", "en_despacho"];
  const existsActive = await Order.exists({ store_id, status: { $in: ACTIVE } });

  console.log("🔍 Buscando pedidos activos para esta tienda...");
  if (existsActive) {
    console.log("❌ Ya existe un pedido activo para esta tienda. Bloqueado.");
    return res.status(409).json({ error: "Ya existe un pedido activo para esta tienda" });
  }
  console.log("✅ No hay pedidos activos en esta tienda, se puede crear uno nuevo.");

  // 3️⃣ Validar productos del catálogo activos
  const productIds = items.map((i) => i.product_id);
  const products = await Product.find({ _id: { $in: productIds }, active: true });
  if (products.length !== items.length)
    return res.status(400).json({ error: "Uno o más productos no existen o no están activos" });

  // 4️⃣ Verificar stock disponible y descontar
  const normalized = [];

  for (const i of items) {
    const p = products.find((pp) => String(pp._id) === String(i.product_id));
    if (!p) continue;

    // 🔹 Validar stock suficiente
    if (p.stock < i.quantity) {
      console.log(`⚠️ Stock insuficiente para ${p.name}. Disponible: ${p.stock}, solicitado: ${i.quantity}`);
      return res.status(400).json({
        error: `Stock insuficiente para ${p.name}. Disponible: ${p.stock}, solicitado: ${i.quantity}`,
      });
    }

    // 🔹 Descontar stock
    p.stock -= i.quantity;
    if (p.stock < 0) p.stock = 0; // seguridad extra
    await p.save();

    console.log(`📦 Nuevo stock de ${p.name}: ${p.stock}`);

    normalized.push({
      product_id: p._id,
      product_name: p.name,
      sku: p.sku,
      quantity: i.quantity,
      price: p.price,
    });
  }

  // 5️⃣ Crear pedido con deadline 72h
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
    consolidation_id: null,
  });

  console.log("🟢 Pedido creado correctamente:");
  console.log(`🧾 ID: ${order._id}`);
  console.log(`🏪 Tienda: ${store.name}`);
  console.log(`📍 Zona: ${zone}`);
  console.log(`👤 Tendero: ${tendero_user_id}`);
  console.log(`🕒 Fecha: ${order.created_at}`);

  res.status(201).json(order);
});

// ==============================================
// POST /api/orders/:id/received  (TENDERO marca recibido)
// ==============================================
export const markReceived = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) return res.status(404).json({ error: "Pedido no encontrado" });

  console.log(`📦 [MARCAR RECIBIDO] Pedido ${order._id} — Estado actual: ${order.status}`);

  // Solo se puede marcar recibido si ya fue entregado
  if (order.status !== "entregado")
    return res.status(400).json({ error: "El pedido aún no está en estado 'entregado'" });

  order.received = true;
  order.received_at = new Date();
  await order.save();

  console.log(`✅ Pedido ${order._id} marcado como recibido.`);
  res.json({ ok: true, order });
});
