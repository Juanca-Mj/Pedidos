import jwt from "jsonwebtoken";

export const requireAuth = (roles = []) => {
  // roles: [] => cualquiera autenticado; ["PLATAFORMA"] => solo plataforma; etc.
  return (req, res, next) => {
    try {
      const header = req.headers.authorization || "";
      const token = header.startsWith("Bearer ") ? header.slice(7) : null;
      if (!token) return res.status(401).json({ message: "No autorizado" });

      const payload = jwt.verify(token, process.env.JWT_SECRET);
      req.user = { id: payload.id, role: payload.role, name: payload.name };

      if (Array.isArray(roles) && roles.length > 0 && !roles.includes(req.user.role)) {
        return res.status(403).json({ message: "Prohibido: rol insuficiente" });
      }
      next();
    } catch {
      return res.status(401).json({ message: "Token inválido o expirado" });
    }
  };
};
