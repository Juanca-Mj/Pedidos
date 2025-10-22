import express from "express";
import {
  getProducts,
  createProduct,
  toggleProduct,
  updateStock,
  addStock
} from "../controllers/productController.js";
import { validateRole } from "../utils/validateRole.js";

const router = express.Router();


router.get("/", getProducts);
router.post("/", validateRole("PLATAFORMA"), createProduct);
router.put("/:id/toggle", validateRole("PLATAFORMA"), toggleProduct);



router.put("/:id/stock", validateRole("PLATAFORMA"), updateStock);

// 🔹 Reabastecer stock (sumar unidades sin sobrescribir el valor actual)
router.put("/:id/stock/add", validateRole("PLATAFORMA"), addStock);

export default router;
