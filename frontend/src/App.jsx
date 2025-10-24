import { Outlet } from "react-router-dom";
import NavBar from "./components/NavBar";

export default function App() {
  const usuario = localStorage.getItem("usuarioActivo") || "";

  // Detectar rol por el correo o nombre guardado
  const isTendero = usuario.includes("@tendero");
  const isPlataforma = usuario.includes("@plataforma");
  const isProveedor = usuario.includes("@proveedor");

  return (
    <div className="app">
      <div className="container">
        <h1>Pedidos por Zona</h1>
        <p className="small">(roles: Tendero, Plataforma, Proveedor)</p>

        {/* ✅ Pasamos el rol detectado al NavBar */}
        <NavBar
          isTendero={isTendero}
          isPlataforma={isPlataforma}
          isProveedor={isProveedor}
        />

        <Outlet />
      </div>
    </div>
  );
}
