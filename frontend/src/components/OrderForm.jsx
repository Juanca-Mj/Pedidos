import { useEffect, useState } from "react";

export default function OrderForm({ stores, products, onSubmit, loading }){
  const [storeId, setStoreId] = useState('');
  const [tenderoUserId, setTenderoUserId] = useState('');
  const [items, setItems] = useState([{ product_id:'', quantity:1 }]);

  useEffect(()=>{ 
    if(stores.length){ 
      setStoreId(stores[0]._id); 
      setTenderoUserId(stores[0].tendero_user_id?._id || stores[0].tendero_user_id); 
    }
  },[stores]);

  const updateItem = (idx, field, value)=>{
    const copy = [...items];
    copy[idx] = { ...copy[idx], [field]: value };
    setItems(copy);
  };
  const addItem = ()=> setItems([...items, { product_id:'', quantity:1 }]);
  const removeItem = (idx)=> setItems(items.filter((_,i)=>i!==idx));

  const submit = (e)=>{
    e.preventDefault();
    onSubmit({ tendero_user_id: tenderoUserId, store_id: storeId, items });
  }



  return (
    <div className="card">
      <h3>Nuevo pedido (Tendero)</h3>
      <form onSubmit={submit} className="row">
        <div>
          <label>Tienda</label><br/>
          <select value={storeId} onChange={e=>setStoreId(e.target.value)}>
            {stores.map(s=><option key={s._id} value={s._id}>{s.name} — {s.zone}</option>)}
          </select>
        </div>

        <div style={{width:'100%'}}>
          <h4>Ítems</h4>
          {items.map((it,idx)=>(
            <div key={idx} className="row" style={{alignItems:'center'}}>
              <select value={it.product_id} onChange={e=>updateItem(idx,'product_id',e.target.value)}>
                <option value="">-- seleccionar producto --</option>
                {products.map(p=><option key={p._id} value={p._id}>{p.name} ({p.sku})</option>)}
              </select>
              <input type="number" min="1" value={it.quantity} onChange={e=>updateItem(idx,'quantity',Number(e.target.value))}/>
              <button type="button" onClick={()=>removeItem(idx)}>Eliminar</button>
            </div>
          ))}
          <button type="button" onClick={addItem}>+ Agregar producto</button>
        </div>

        <div style={{width:'100%'}}>
          <button className="btn" disabled={loading}>Crear pedido</button>
        </div>
      </form>
    </div>
  )
}
