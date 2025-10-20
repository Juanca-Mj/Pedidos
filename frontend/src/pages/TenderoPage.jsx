import { useEffect, useState } from "react";
import { api } from "../api/client";
import ProductsList from "../components/ProductsList";
import OrderForm from "../components/OrderForm";
import OrdersTable from "../components/OrdersTable";

export default function TenderoPage(){
  const [products, setProducts] = useState([]);
  const [stores, setStores] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  const load = async ()=>{
    const [p, s, o] = await Promise.all([
      api.listProducts(),
      api.listStores(),
      api.listOrders()
    ]);
    setProducts(p);
    setStores(s);
    setOrders(o.filter(ord => ord.tendero_user_id)); // simple filtrado
  };

  useEffect(()=>{ load(); },[]);

  const createOrder = async (payload)=>{
    setLoading(true);
    try{
      await api.createOrder(payload);
      await load();
      alert('Pedido creado. Si hay otros pedidos en tu zona, la Plataforma lo consolidará.');
    }catch(e){ alert(e.message) } finally{ setLoading(false) }
  }

  const markReceived = async (id)=>{
    try{
      await api.markOrderReceived(id);
      await load();
    }catch(e){ alert(e.message) }
  }

  return (
    <>
      <div className="card"><h2>Panel TENDERO</h2><p className="small">Crea pedidos seleccionando productos del catálogo.</p></div>
      <OrderForm stores={stores} products={products} onSubmit={createOrder} loading={loading}/>
      <ProductsList products={products}/>
      <OrdersTable orders={orders} onMarkReceived={markReceived}/>
    </>
  );
}
