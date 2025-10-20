// Middleware de autorización por rol (simple para pruebas con Postman)
// Usar header: x-role: TENDERO | PLATAFORMA | PROVEEDOR
export const validateRole = (...allowed) => (req, res, next) => {
  const headerRole = req.headers["x-role"];
  const role = headerRole || req.user?.role || req.body?.role;
  if (!role) return res.status(401).json({ error: "Rol no provisto (x-role)" });
  if (!allowed.includes(role))
    return res.status(403).json({ error: `Acceso denegado: requiere rol ${allowed.join(" o ")}` });
  next();
};
