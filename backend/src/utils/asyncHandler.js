// Envuelve controladores async para capturar errores sin try/catch repetidos
export const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);
