import { useEffect, useState } from "react";
import { api } from "../api/client";
import ProductsList from "../components/ProductsList";
import OrderForm from "../components/OrderForm";
import OrdersTable from "../components/OrdersTable";

export default function TenderoPage() {
  const [products, setProducts] = useState([]);
  const [stores, setStores] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    const [p, s, o] = await Promise.all([
      api.listProducts(),
      api.listStores(),
      api.listOrders(),
    ]);
    setProducts(p);
    setStores(s);
    setOrders(o.filter((ord) => ord.tendero_user_id)); // simple filtrado
  };

  useEffect(() => {
    load();
  }, []);

  const createOrder = async (payload) => {
    setLoading(true);
    try {
      await api.createOrder(payload);
      await load();
      alert(
        "Pedido creado. Si hay otros pedidos en tu zona, la Plataforma lo consolidará."
      );
    } catch (e) {
      alert(e.message);
    } finally {
      setLoading(false);
    }
  };

  const markReceived = async (id) => {
    try {
      await api.markOrderReceived(id);
      await load();
    } catch (e) {
      alert(e.message);
    }
  };

  // NUEVO: crear tienda
const createStore = async (e) => {
  e.preventDefault();
  const fd = new FormData(e.target);
  const body = {
    name: fd.get("name"),
    zone: fd.get("zone"),
    contact: fd.get("contact"),
  }; // ✅ SIN tendero_user_id, lo maneja el backend

  try {
    await api.createStore(body);
    alert("✅ Tienda creada correctamente");
    e.target.reset();
    await load();
  } catch (err) {
    alert(err.message);
  }
};


  return (
    <>
      <div className="card">
        <h2>Panel TENDERO</h2>
        <p className="small">
          Crea pedidos seleccionando productos del catálogo o registra una
          nueva tienda con su zona.
        </p>
      </div>

      <div className="card">
        <h3>Registrar nueva tienda</h3>
        <form onSubmit={createStore} className="row">
          <input name="name" placeholder="Nombre de la tienda" required />
          <input name="zone" placeholder="Zona (ej: Zona Norte)" required />
          <input name="contact" placeholder="Contacto (teléfono o correo)" />
          <button className="btn">Crear tienda</button>
        </form>
      </div>

      <OrderForm
        stores={stores}
        products={products}
        onSubmit={createOrder}
        loading={loading}
      />
      <ProductsList products={products} />
      <OrdersTable orders={orders} onMarkReceived={markReceived} />
    </>
  );
}
