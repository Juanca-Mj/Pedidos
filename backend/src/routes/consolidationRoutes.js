import express from "express";
import {
  getConsolidations,
  createConsolidation,
  assignProvider,
  moveToDispatch,
  markDelivered
} from "../controllers/consolidationController.js";
import { validateRole } from "../utils/validateRole.js";

const router = express.Router();

router.get("/", getConsolidations);
router.post("/", validateRole("PLATAFORMA"), createConsolidation);
router.post("/:id/assign-provider", validateRole("PLATAFORMA"), assignProvider);
router.post("/:id/dispatch", validateRole("PROVEEDOR"), moveToDispatch);
router.post("/:id/deliver", validateRole("PROVEEDOR"), markDelivered);

export default router;
