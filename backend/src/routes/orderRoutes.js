import express from "express";
import { getOrders, createOrder, markReceived } from "../controllers/orderController.js";
import { validateRole } from "../utils/validateRole.js";

const router = express.Router();

router.get("/", getOrders);
router.post("/", validateRole("TENDERO"), createOrder);
router.post("/:id/received", validateRole("TENDERO"), markReceived);

export default router;
