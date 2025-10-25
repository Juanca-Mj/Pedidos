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

  // === Cargar datos ===
  const load = async () => {
    const [p, s, o] = await Promise.all([
      api.listProducts(),
      api.listStores(),
      api.listOrders(),
    ]);
    setProducts(p);
    setStores(s);
    setOrders(o.filter((ord) => ord.tendero_user_id)); // filtrado simple
  };

  useEffect(() => {
    load();
  }, []);

  // === Crear pedido (verifica stock antes) ===
  const createOrder = async (payload) => {
    setLoading(true);
    try {
      // 🔹 Validar stock antes de enviar al backend
      const invalid = payload.items.find((i) => {
        const prod = products.find((p) => p._id === i.product_id);
        return !prod || prod.stock <= 0 || i.quantity > prod.stock;
      });

      if (invalid) {
        const prod = products.find((p) => p._id === invalid.product_id);
        alert(
          `❌ No hay suficiente stock para "${prod?.name}". Disponible: ${prod?.stock || 0}`
        );
        setLoading(false);
        return;
      }

      await api.createOrder(payload);
      await load();
      alert(
        "✅ Pedido creado. Si hay otros pedidos en tu zona, la Plataforma lo consolidará."
      );
    } catch (e) {
      alert(e.message);
    } finally {
      setLoading(false);
    }
  };

  // === Marcar pedido como recibido ===
  const markReceived = async (id) => {
    try {
      await api.markOrderReceived(id);
      await load();
    } catch (e) {
      alert(e.message);
    }
  };

  // === Crear tienda ===
  const createStore = async (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const body = {
      name: fd.get("name"),
      zone: fd.get("zone"),
      contact: fd.get("contact"),
    };

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
      {/* === ENCABEZADO CON BOTÓN === */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <h2>Bienvenido tendero</h2>

        <button
          className="btn"
          style={{
            backgroundColor: "#dc2626",
            color: "#fff",
            padding: "8px 16px",
            borderRadius: "8px",
          }}
          onClick={() => {
            localStorage.removeItem("usuarioActivo");
            window.location.href = "/";
          }}
        >
          Cerrar sesión
        </button>
      </div>

      {/* === DESCRIPCIÓN === */}
      <div className="card">
        <p className="small">
          Crea pedidos seleccionando productos del catálogo o registra una nueva
          tienda con su zona.
        </p>
      </div>

      {/* === FORMULARIO NUEVA TIENDA === */}
      <div className="card">
        <h3>Registrar nueva tienda</h3>
        <form onSubmit={createStore} className="row">
          <input name="name" placeholder="Nombre de la tienda" required />
          <input name="zone" placeholder="Zona (ej: Zona Norte)" required />
          <input name="contact" placeholder="Contacto (teléfono o correo)" />
          <button className="btn">Crear tienda</button>
        </form>
      </div>

      {/* === FORMULARIO DE PEDIDOS === */}
      <OrderForm
        stores={stores}
        products={products.filter((p) => p.active && p.stock > 0)} // 🔹 Solo productos activos y con stock
        onSubmit={createOrder}
        loading={loading}
      />

      {/* === LISTA DE PRODUCTOS === */}
      <ProductsList products={products} />

      {/* === PEDIDOS === */}
      <OrdersTable orders={orders} onMarkReceived={markReceived} />
    </>
  );
}
