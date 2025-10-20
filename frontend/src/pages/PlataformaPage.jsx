import { useEffect, useState } from "react";
import { api } from "../api/client";
import ProductsList from "../components/ProductsList";
import ConsolidationsTable from "../components/ConsolidationsTable";
import AssignProviderForm from "../components/AssignProviderForm";

export default function PlataformaPage(){
  const [products, setProducts] = useState([]);
  const [conss, setConss] = useState([]);
  const [zones, setZones] = useState(["Zona Norte","Zona Centro","Zona Sur"]);
  const [zone, setZone] = useState("Zona Norte");
  const [providers, setProviders] = useState([]);

  const load = async ()=>{
    const p = await api.listProducts();
    const cs = await api.listConsolidations();
    const users = await api.listUsers();
    setProducts(p);
    setConss(cs);
    setProviders(users.filter(u=>u.role==="PROVEEDOR"));
  };

  useEffect(()=>{ load(); },[]);

  const addProduct = async (e)=>{
    e.preventDefault();
    const fd = new FormData(e.target);
    const body = {
      name: fd.get("name"),
      sku: fd.get("sku"),
      price: Number(fd.get("price")),
      unit: fd.get("unit"),
      created_by_role: "PLATAFORMA"
    };
    try{
      await api.createProduct(body);
      e.target.reset();
      await load();
    }catch(err){ alert(err.message) }
  }

  const toggleProduct = async (id)=>{
    try{ await api.toggleProduct(id); await load(); }
    catch(err){ alert(err.message) }
  }

  const createCons = async ()=>{
    try{ await api.createConsolidation(zone); await load(); }
    catch(err){ alert(err.message) }
  }

  const assignProv = async (cons)=>{
    if(!providers.length){ alert('No hay usuarios PROVEEDOR creados. Crea uno en /api/users'); return; }
    const onAssign = async (provider_id)=>{
      try{ await api.assignProvider(cons._id, provider_id); await load(); }
      catch(err){ alert(err.message) }
    }
    const provId = providers[0]._id;
    await onAssign(provId);
  }

  return (
    <>
      <div className="card"><h2>Panel PLATAFORMA</h2><p className="small">Gestiona catálogo, consolida pedidos por zona y asigna proveedor.</p></div>

      <div className="card">
        <h3>Crear producto</h3>
        <form onSubmit={addProduct} className="row">
          <input name="name" placeholder="Nombre" required />
          <input name="sku" placeholder="SKU" required />
          <input name="price" type="number" placeholder="Precio" required />
          <input name="unit" placeholder="Unidad (ej. bulto 40kg)" />
          <button className="btn">Crear</button>
        </form>
      </div>

      <ProductsList products={products} onToggle={toggleProduct}/>

      <div className="card">
        <h3>Consolidar por zona</h3>
        <div className="row">
          <select value={zone} onChange={e=>setZone(e.target.value)}>
            {zones.map(z=><option key={z} value={z}>{z}</option>)}
          </select>
          <button className="btn" onClick={createCons}>Crear consolidación</button>
        </div>
      </div>

      <ConsolidationsTable
        items={conss}
        actions={{
          onAssign: assignProv
        }}
      />

      {providers.length>0 && (
        <div className="card">
          <h3>Proveedores disponibles</h3>
          <ul className="small">
            {providers.map(p=><li key={p._id}>{p.name} — {p.contact}</li>)}
          </ul>
          <p className="small">* Los proveedores son usuarios con rol PROVEEDOR en tu backend.</p>
        </div>
      )}
    </>
  );
}
