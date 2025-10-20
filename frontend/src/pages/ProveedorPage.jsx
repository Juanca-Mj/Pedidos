import { useEffect, useState } from "react";
import { api } from "../api/client";
import ConsolidationsTable from "../components/ConsolidationsTable";

export default function ProveedorPage(){
  const [conss, setConss] = useState([]);

  const load = async ()=> setConss(await api.listConsolidations());

  useEffect(()=>{ load(); },[]);

  const dispatch = async (c)=>{ try{ await api.moveToDispatch(c._id); await load(); }catch(e){ alert(e.message) } }
  const delivered = async (c)=>{ try{ await api.markDelivered(c._id); await load(); }catch(e){ alert(e.message) } }

  return (
    <>
      <div className="card"><h2>Panel PROVEEDOR</h2><p className="small">Actualiza estados: en despacho → entregado.</p></div>

      <ConsolidationsTable
        items={conss}
        actions={{
          onDispatch: dispatch,
          onDelivered: delivered
        }}
      />
    </>
  );
}
