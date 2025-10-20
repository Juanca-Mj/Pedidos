import express from "express";
import { getStores, createStore } from "../controllers/storeController.js";
import { validateRole } from "../utils/validateRole.js";

const router = express.Router();

router.get("/", getStores);
router.post("/", validateRole("PLATAFORMA"), createStore);

export default router;
