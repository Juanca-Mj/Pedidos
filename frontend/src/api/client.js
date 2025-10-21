// src/api/client.js
const API = import.meta.env.VITE_API_URL || "http://localhost:4000";

// Función base para peticiones HTTP
async function http(path, { method = "GET", body, role } = {}) {
  const headers = { "Content-Type": "application/json" };
  if (role) headers["x-role"] = role; // Simula autenticación por rol

  const res = await fetch(`${API}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    let msg = `HTTP ${res.status}`;
    try {
      const data = await res.json();
      msg += ` - ${data.error || JSON.stringify(data)}`;
    } catch {}
    throw new Error(msg);
  }

  return res.json();
}

// ==========================================
// === API GENERAL (centralizada) ===========
// ==========================================
export const api = {
  // === Productos ===
  listProducts: () => http("/api/products"),
  createProduct: (data) =>
    http("/api/products", {
      method: "POST",
      body: data,
      role: "PLATAFORMA",
    }),
  toggleProduct: (id) =>
    http(`/api/products/${id}/toggle`, {
      method: "PUT",
      role: "PLATAFORMA",
    }),

  // === Tiendas ===
  listStores: () => http("/api/stores"),
  createStore: (data) =>
    http("/api/stores", {
      method: "POST",
      body: data,
      role: "PLATAFORMA", // o "TENDERO" si decides permitirlo
    }),
  updateStore: (id, data) =>
    http(`/api/stores/${id}`, {
      method: "PUT",
      body: data,
      role: "PLATAFORMA",
    }),
  deleteStore: (id) =>
    http(`/api/stores/${id}`, {
      method: "DELETE",
      role: "PLATAFORMA",
    }),

  // === Usuarios / Proveedores ===
  listUsers: () => http("/api/users"),
  createUser: (data) =>
    http("/api/users", {
      method: "POST",
      body: data,
      role: "PLATAFORMA",
    }),
  updateUser: (id, data) =>
    http(`/api/users/${id}`, {
      method: "PUT",
      body: data,
      role: "PLATAFORMA",
    }),
  deleteUser: (id) =>
    http(`/api/users/${id}`, {
      method: "DELETE",
      role: "PLATAFORMA",
    }),

  // 🔹 Nuevo: obtener proveedores filtrados por zona (opcional)
  listProvidersByZone: (zone = "") =>
    http(`/api/providers${zone ? `?zone=${zone}` : ""}`, {
      method: "GET",
      role: "PLATAFORMA",
    }),

  // === Pedidos ===
  listOrders: (qs = "") => http(`/api/orders${qs}`),
  createOrder: (data) =>
    http("/api/orders", { method: "POST", body: data, role: "TENDERO" }),
  markOrderReceived: (id) =>
    http(`/api/orders/${id}/received`, { method: "POST", role: "TENDERO" }),

  // === Consolidaciones ===
  listConsolidations: (qs = "") => http(`/api/consolidations${qs}`),
  createConsolidation: (zone) =>
    http("/api/consolidations", {
      method: "POST",
      role: "PLATAFORMA",
      body: { zone },
    }),
  assignProvider: (id, provider_user_id) =>
    http(`/api/consolidations/${id}/assign-provider`, {
      method: "POST",
      role: "PLATAFORMA",
      body: { provider_user_id },
    }),
  moveToDispatch: (id) =>
    http(`/api/consolidations/${id}/dispatch`, {
      method: "POST",
      role: "PROVEEDOR",
    }),
  markDelivered: (id) =>
    http(`/api/consolidations/${id}/deliver`, {
      method: "POST",
      role: "PROVEEDOR",
    }),
};
