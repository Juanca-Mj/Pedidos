import express from "express";
import { getProducts, createProduct, toggleProduct } from "../controllers/productController.js";
import { validateRole } from "../utils/validateRole.js";

const router = express.Router();

router.get("/", getProducts);
router.post("/", validateRole("PLATAFORMA"), createProduct);
router.put("/:id/toggle", validateRole("PLATAFORMA"), toggleProduct);

export default router;
