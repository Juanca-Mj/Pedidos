import express from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";

// Importar rutas
import userRoutes from "./routes/userRoutes.js";
import storeRoutes from "./routes/storeRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import consolidationRoutes from "./routes/consolidationRoutes.js";
import zoneRoutes from "./routes/zoneRoutes.js";

dotenv.config();
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// Conexión a MongoDB
connectDB();

// Ruta principal
app.get("/", (req, res) => res.send("API Pedidos Tenderos ✅ funcionando"));

// Rutas API
app.use("/api/users", userRoutes);
app.use("/api/stores", storeRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/consolidations", consolidationRoutes);
app.use("/api/zones", zoneRoutes);

// Manejo de 404
app.use((req, res) => res.status(404).json({ error: "Ruta no encontrada" }));

// Servidor
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`🚀 Servidor en puerto ${PORT}`));
