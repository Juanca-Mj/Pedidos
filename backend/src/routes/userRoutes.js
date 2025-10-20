import express from "express";
import { getUsers, createUser } from "../controllers/userController.js";
import { validateRole } from "../utils/validateRole.js";

const router = express.Router();

router.get("/", getUsers);
router.post("/", validateRole("PLATAFORMA"), createUser);

export default router;
