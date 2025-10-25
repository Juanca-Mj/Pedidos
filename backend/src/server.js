import express from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";

// 🧩 Importar rutas existentes
import userRoutes from "./routes/userRoutes.js";
import storeRoutes from "./routes/storeRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import consolidationRoutes from "./routes/consolidationRoutes.js";
import zoneRoutes from "./routes/zoneRoutes.js";

// 🆕 Nueva ruta de autenticación (login / registro)
import authRoutes from "./routes/authRoutes.js";

dotenv.config();
const app = express();


// Middlewares globales
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));


// Conexión a MongoDB Atlas

connectDB();


// Ruta raíz (verificación rápida del backend)
app.get("/", (req, res) => {
  res.send("🚀 API Pedidos Tenderos ✅ funcionando correctamente");
});

// Rutas API existentes

app.use("/api/users", userRoutes);
app.use("/api/stores", storeRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/consolidations", consolidationRoutes);
app.use("/api/zones", zoneRoutes);


// 🆕 Rutas nuevas de autenticación

app.use("/api/auth", authRoutes);


// Manejo de rutas no encontradas

app.use((req, res) => res.status(404).json({ error: "Ruta no encontrada" }));


// Servidor HTTP

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
});
