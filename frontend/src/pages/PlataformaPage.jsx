import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { api } from "../api/client";
import ProductsList from "../components/ProductsList";
import ConsolidationsTable from "../components/ConsolidationsTable";

export default function PlataformaPage() {
  const [products, setProducts] = useState([]);
  const [conss, setConss] = useState([]);
  const [zones, setZones] = useState([]); // ✅ dinámico desde backend
  const [zone, setZone] = useState("");
  const [providers, setProviders] = useState([]);

  // === Cargar datos ===
  const load = async () => {
    const [p, cs, users, zs] = await Promise.all([
      api.listProducts(),
      api.listConsolidations(),
      api.listUsers(),
      api.listZones(),
    ]);
    setProducts(p);
    setConss(cs);
    setProviders(users.filter((u) => u.role === "PROVEEDOR"));
    setZones(zs);
    if (zs.length > 0 && !zone) setZone(zs[0].name);
  };

  useEffect(() => {
    load();
  }, []);

  // === Crear producto ===
  const addProduct = async (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const body = {
      name: fd.get("name"),
      sku: fd.get("sku"),
      price: Number(fd.get("price")),
      unit: fd.get("unit"),
      stock: Number(fd.get("stock")),
      created_by_role: "PLATAFORMA",
    };

    try {
      await api.createProduct(body);
      Swal.fire("✅ Producto creado", "El producto fue registrado exitosamente", "success");
      e.target.reset();
      await load();
    } catch (err) {
      Swal.fire("Error", err.message, "error");
    }
  };

  // === Crear zona ===
  const addZone = async (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const name = fd.get("name").trim();

    if (!name) {
      Swal.fire("Error", "Debe ingresar un nombre de zona", "error");
      return;
    }

    try {
      await api.createZone({ name });
      Swal.fire("✅ Zona creada", `La zona "${name}" fue registrada correctamente`, "success");
      e.target.reset();
      await load();
    } catch (err) {
      Swal.fire("Error", err.message, "error");
    }
  };

  // === Eliminar zona ===
  const deleteZone = async (id, name) => {
    const confirm = await Swal.fire({
      title: "¿Eliminar zona?",
      text: `Se eliminará la zona "${name}". Esta acción no se puede deshacer.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (!confirm.isConfirmed) return;

    try {
      await api.deleteZone(id);
      Swal.fire("🗑️ Zona eliminada", `La zona "${name}" fue eliminada`, "success");
      await load();
    } catch (err) {
      Swal.fire("Error", err.message, "error");
    }
  };

  // === Activar/desactivar producto ===
  const toggleProduct = async (id) => {
    try {
      await api.toggleProduct(id);
      await load();
    } catch (err) {
      Swal.fire("Error", err.message, "error");
    }
  };

  // === Crear consolidación ===
  const createCons = async () => {
    const provsZona = providers.filter(
      (p) =>
        p.zones?.includes(zone) &&
        (!p.status || p.status === "Disponible" || p.status === "libre")
    );

    if (provsZona.length === 0) {
      Swal.fire(
        "Sin proveedores disponibles",
        `No hay proveedores activos en la zona "${zone}".`,
        "warning"
      );
      return;
    }

    try {
      await api.createConsolidation(zone);
      Swal.fire("Consolidación creada", `Zona "${zone}" consolidada correctamente ✅`, "success");
      await load();
    } catch (err) {
      Swal.fire("Error", err.message, "error");
    }
  };

  // === Asignar proveedor ===
  const assignProv = async (cons) => {
    const provsZona = providers.filter(
      (p) =>
        p.zones?.includes(cons.zone) &&
        (!p.status || p.status === "Disponible" || p.status === "libre")
    );

    if (provsZona.length === 0) {
      Swal.fire(
        "Sin proveedores disponibles",
        `No hay proveedores activos en la zona "${cons.zone}".`,
        "warning"
      );
      return;
    }

    const options = provsZona.map((p) => ({
      id: p._id,
      name: `${p.name} — ${p.contact}`,
    }));

    const { value: provId } = await Swal.fire({
      title: "Asignar proveedor",
      input: "select",
      inputOptions: Object.fromEntries(options.map((p) => [p.id, p.name])),
      inputPlaceholder: "Selecciona un proveedor",
      showCancelButton: true,
      confirmButtonText: "Asignar",
    });

    if (!provId) return;

    try {
      await api.assignProvider(cons._id, provId);
      Swal.fire("Asignado", "Proveedor asignado correctamente ✅", "success");
      await load();
    } catch (err) {
      Swal.fire("Error", err.message, "error");
    }
  };

  return (
    <>
      <div className="card">
        <h2>Panel PLATAFORMA</h2>
        <p className="small">
          Gestiona catálogo, zonas, consolida pedidos por zona y asigna proveedores.
        </p>
      </div>

      {/* === CREAR PRODUCTO === */}
      <div className="card">
        <h3>Crear producto</h3>
        <form onSubmit={addProduct} className="row">
          <input name="name" placeholder="Nombre" required />
          <input name="sku" placeholder="SKU" required />
          <input name="price" type="number" placeholder="Precio" required />
          <input name="unit" placeholder="Unidad (ej. bulto 40kg)" />
          <input name="stock" type="number" placeholder="Stock inicial" min="0" required />
          <button className="btn">Crear</button>
        </form>
      </div>

      <ProductsList products={products} onToggle={toggleProduct} />

      {/* === GESTIÓN DE ZONAS === */}
      <div className="card">
        <h3>Gestión de zonas</h3>
        <form onSubmit={addZone} className="row">
          <input name="name" placeholder="Nombre de la zona (ej: Zona Oeste)" required />
          <button className="btn">Crear zona</button>
        </form>

        {zones.length > 0 && (
          <table style={{ marginTop: "10px", width: "100%" }}>
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Acción</th>
              </tr>
            </thead>
            <tbody>
              {zones.map((z) => (
                <tr key={z._id}>
                  <td>{z.name}</td>
                  <td>
                    <button
                      className="btn btn-danger"
                      onClick={() => deleteZone(z._id, z.name)}
                      style={{
                        backgroundColor: "#dc3545",
                        color: "white",
                        padding: "4px 8px",
                        borderRadius: "8px",
                      }}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* === CONSOLIDAR POR ZONA === */}
      <div className="card">
        <h3>Consolidar por zona</h3>
        <div className="row">
          <select value={zone} onChange={(e) => setZone(e.target.value)}>
            {zones.map((z) => (
              <option key={z._id} value={z.name}>
                {z.name}
              </option>
            ))}
          </select>
          <button className="btn" onClick={createCons}>
            Crear consolidación
          </button>
        </div>
      </div>

      <ConsolidationsTable
        items={conss}
        actions={{
          onAssign: assignProv,
        }}
      />

      {/* === LISTA DE PROVEEDORES === */}
      {providers.length > 0 && (
        <div className="card">
          <h3>Proveedores disponibles</h3>
          <ul className="small">
            {providers.map((p) => (
              <li key={p._id}>
                {p.name} — {p.contact} ({p.zones?.join(", ") || "Sin zona"})
              </li>
            ))}
          </ul>
          <p className="small">
            * Solo los proveedores con zonas coincidentes podrán ser asignados a consolidaciones.
          </p>
        </div>
      )}
    </>
  );
}
