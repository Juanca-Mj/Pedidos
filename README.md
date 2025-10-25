# 🏪 Pedidos por Zona — Sistema de Consolidación de Pedidos (MERN)

Proyecto completo desarrollado con **MongoDB, Express, React y Node.js (MERN)**.  
Permite gestionar pedidos de tiendas ("tenderos"), centralizarlos en una **plataforma**  
y asignarlos a **proveedores**, con consolidación automática por zona.

---

## 📂 Estructura del proyecto

PARCIAL_PEDIDOS/
│
├── backend/ # API REST con Express + MongoDB
│ ├── src/
│ │ ├── config/ # Conexión y configuración de la BD
│ │ ├── models/ # Esquemas Mongoose (Users, Orders, etc.)
│ │ ├── controllers/ # Lógica de negocio por entidad
│ │ ├── routes/ # Endpoints organizados por módulo
│ │ └── utils/ # Middlewares, validaciones y helpers
│ ├── .env # Variables de entorno (URI Mongo + puerto)
│ ├── package.json
│ └── server.js
│
└── frontend/ # Interfaz React con Vite
├── src/
│ ├── api/ # Conexión al backend con axios
│ ├── pages/ # Vistas según el rol (Tendero, Plataforma, Proveedor)
│ ├── components/ # NavBar, Cards, Formularios, etc.
│ └── App.jsx / main.jsx
├── package.json
└── vite.config.js

---

## ⚙️ Instalación y ejecución
🔹 2. Configurar el backend
cd backend
npm install


Crea un archivo .env con estos de conexión:

PORT=4000
MONGO_URI=mongodb+srv://Juanca:Juanca%406021@tienda.onidavh.mongodb.net/pedidos_tenderos?retryWrites=true&w=majority
DB_NAME=pedidos_tenderos
NODE_ENV=development
LOG_LEVEL=dev


Ejecuta el servidor:

npm run dev


✅ Si ves: ✅ Conexión exitosa a MongoDB Atlas y 🚀 Servidor en puerto 4000, el backend está funcionando.

🔹 3. Configurar el frontend
cd ../frontend
npm install
npm install react-router-dom
npm run dev


🧠 Roles y funcionalidades
Rol	Funcionalidades principales
🟢 Tendero	Crear pedidos, ver estado del pedido, marcar recibido.
🟠 Plataforma	Visualizar pedidos, consolidar por zona, asignar proveedor.
🔵 Proveedor	Ver consolidaciones asignadas, marcar despacho y entrega.


🧰 Tecnologías utilizadas

Backend: Node.js, Express.js, Mongoose, Morgan, CORS, Dotenv
Base de datos: MongoDB Atlas
Frontend: React, Vite, React Router DOM, Axios
Herramientas: Nodemon, Postman, VS Code


🧩 Reglas de negocio aplicadas

✅ Solo un pedido activo por tendero (pendiente/en consolidación/asignado/en despacho).
✅ Solo una consolidación activa por zona.
✅ Consolidaciones agrupan pedidos automáticamente por producto y zona.
✅ Estados fluyen secuencialmente:
pendiente → en_consolidacion → en_asignacion → en_despacho → entregado.
