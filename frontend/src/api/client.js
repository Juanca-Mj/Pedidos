const API = import.meta.env.VITE_API_URL || 'http://localhost:4000';

async function http(path, { method = 'GET', body, role } = {}) {
  const headers = { 'Content-Type': 'application/json' };
  // Simulamos auth por rol con el header x-role (coincide con tu backend)
  if (role) headers['x-role'] = role;

  const res = await fetch(`${API}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined
  });

  if (!res.ok) {
    let msg = `HTTP ${res.status}`;
    try { const data = await res.json(); msg += ` - ${data.error || JSON.stringify(data)}` } catch {}
    throw new Error(msg);
  }
  return res.json();
}

export const api = {
  // Productos
  listProducts: () => http('/api/products'),
  createProduct: (data) => http('/api/products', { method: 'POST', body: data, role: 'PLATAFORMA' }),
  toggleProduct: (id) => http(`/api/products/${id}/toggle`, { method: 'PUT', role: 'PLATAFORMA' }),

  // Tiendas / Usuarios (solo lo mínimo que usamos aquí)
  listStores: () => http('/api/stores'),
  listUsers: () => http('/api/users'),

  // Pedidos
  listOrders: (qs='') => http(`/api/orders${qs}`),
  createOrder: (data) => http('/api/orders', { method: 'POST', body: data, role: 'TENDERO' }),
  markOrderReceived: (id) => http(`/api/orders/${id}/received`, { method: 'POST', role: 'TENDERO' }),

  // Consolidaciones
  listConsolidations: (qs='') => http(`/api/consolidations${qs}`),
  createConsolidation: (zone) => http('/api/consolidations', { method: 'POST', role: 'PLATAFORMA', body: { zone } }),
  assignProvider: (id, provider_user_id) => http(`/api/consolidations/${id}/assign-provider`, { method:'POST', role:'PLATAFORMA', body:{ provider_user_id }}),
  moveToDispatch: (id) => http(`/api/consolidations/${id}/dispatch`, { method:'POST', role:'PROVEEDOR' }),
  markDelivered: (id) => http(`/api/consolidations/${id}/deliver`, { method:'POST', role:'PROVEEDOR' }),
};
