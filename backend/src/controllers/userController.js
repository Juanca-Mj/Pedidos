import User from "../models/User.js";
import Provider from "../models/Provider.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// =====================================================
// GET /api/users
// =====================================================
export const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find().sort({ created_at: -1 });
  res.json(users);
});

// =====================================================
// POST /api/users
// Crea usuarios (TENDERO, PLATAFORMA o PROVEEDOR)
// Si es PROVEEDOR => también crea un Provider asociado
// =====================================================
export const createUser = asyncHandler(async (req, res) => {
  const { role, name, contact, zones } = req.body;

  // 1️⃣ Crear el usuario
  const user = await User.create({
    role,
    name,
    contact,
    zones: zones || [],       // ⬅️ si viene, lo guarda
    available: true,          // ⬅️ proveedores inician como disponibles
    created_at: new Date(),
  });

  // 2️⃣ Si es proveedor, crear también el documento en "providers"
  if (role === "PROVEEDOR") {
    const provider = await Provider.create({
      company_name: name,
      contact,
      zones: zones || [],
      available: true,
      created_at: new Date(),
    });

    // Vincular el provider_id al user
    user.provider_id = provider._id;
    await user.save();
  }

  res.status(201).json(user);
});

// =====================================================
// PUT /api/users/:id
// Actualiza usuario y su provider asociado (si aplica)
// =====================================================
export const updateUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, contact, zones, available } = req.body;

  const user = await User.findByIdAndUpdate(
    id,
    { name, contact, zones, available },
    { new: true }
  );

  if (user?.role === "PROVEEDOR" && user?.provider_id) {
    await Provider.findByIdAndUpdate(user.provider_id, {
      company_name: name,
      contact,
      zones,
      available,
    });
  }

  res.json(user);
});

// =====================================================
// DELETE /api/users/:id
// Elimina el usuario y el proveedor vinculado si aplica
// =====================================================
export const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const user = await User.findByIdAndDelete(id);

  if (user?.provider_id) {
    await Provider.findByIdAndDelete(user.provider_id);
  }

  res.json({ message: "Usuario eliminado correctamente" });
});

// =====================================================
// GET /api/providers?zone=Zona Norte
// Devuelve proveedores por zona y disponibilidad
// =====================================================
export const getProvidersByZone = asyncHandler(async (req, res) => {
  const { zone } = req.query;
  const query = { role: "PROVEEDOR" };
  if (zone) query.zones = zone;

  const providers = await User.find(query).sort({ available: -1 });
  res.json(providers);
});
