import { Outlet } from "react-router-dom";
import NavBar from "./components/NavBar";

export default function App(){
  return (
    <div className="app">
      <div className="container">
        <h1>Pedidos por Zona</h1>
        <p className="small">(roles: Tendero, Plataforma, Proveedor)</p>
        <NavBar/>
        <Outlet/>
      </div>
    </div>
  );
}
