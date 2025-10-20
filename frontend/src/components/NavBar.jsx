import { NavLink } from "react-router-dom";

export default function NavBar(){
  return (
    <div className="nav">
      <NavLink to="/" end className={({isActive})=>isActive?'active':''}>Tendero</NavLink>
      <NavLink to="/plataforma" className={({isActive})=>isActive?'active':''}>Plataforma</NavLink>
      <NavLink to="/proveedor" className={({isActive})=>isActive?'active':''}>Proveedor</NavLink>
    </div>
  );
}
