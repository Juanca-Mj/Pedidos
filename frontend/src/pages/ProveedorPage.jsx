import { useEffect, useState } from "react";
import { api } from "../api/client";
import ConsolidationsTable from "../components/ConsolidationsTable";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";

export default function ProveedorPage() {
  const [conss, setConss] = useState([]);
  const [proveedores, setProveedores] = useState([]);
  const [form, setForm] = useState({ name: "", contact: "", zones: "" });
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);

  // === Cargar datos ===
  const load = async () => {
    const [c, users] = await Promise.all([
      api.listConsolidations(),
      api.listUsers(),
    ]);
    setConss(c);
    setProveedores(users.filter((u) => u.role === "PROVEEDOR"));
  };

  useEffect(() => {
    load();
  }, []);

  // === Cambiar estado de consolidación ===
  const dispatch = async (c) => {
    try {
      await api.moveToDispatch(c._id);
      Swal.fire("Actualizado", "Consolidación movida a despacho ✅", "success");
      await load();
    } catch (e) {
      Swal.fire("Error", e.message, "error");
    }
  };

  const delivered = async (c) => {
    try {
      await api.markDelivered(c._id);
      Swal.fire("Entregado", "Consolidación marcada como entregada ✅", "success");
      await load();
    } catch (e) {
      Swal.fire("Error", e.message, "error");
    }
  };

  // === Crear o editar proveedor ===
  const handleSubmit = async (e) => {
    e.preventDefault();
    const body = {
      role: "PROVEEDOR",
      name: form.name,
      contact: form.contact,
      zones: form.zones.split(",").map((z) => z.trim()),
    };

    try {
      if (editMode) {
        await api.updateUser(editId, body);
        Swal.fire("Actualizado", "Proveedor actualizado correctamente ✅", "success");
      } else {
        await api.createUser(body);
        Swal.fire("Creado", "Proveedor creado correctamente ✅", "success");
      }
      setForm({ name: "", contact: "", zones: "" });
      setEditMode(false);
      setEditId(null);
      await load();
    } catch (err) {
      Swal.fire("Error", err.message, "error");
    }
  };

  // === Editar proveedor ===
  const handleEdit = (prov) => {
    setEditMode(true);
    setEditId(prov._id);
    setForm({
      name: prov.name,
      contact: prov.contact,
      zones: prov.zones?.join(", ") || "",
    });
    Swal.fire({
      title: "Modo edición",
      text: "Estás editando un proveedor existente.",
      icon: "info",
      confirmButtonText: "Entendido",
    });
  };

  // === Eliminar proveedor ===
  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "¿Eliminar proveedor?",
      text: "Esta acción no se puede deshacer.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (result.isConfirmed) {
      try {
        await api.deleteUser(id);
        Swal.fire("Eliminado", "Proveedor eliminado correctamente ✅", "success");
        await load();
      } catch (err) {
        Swal.fire("Error", err.message, "error");
      }
    }
  };

  return (
    <>
      {/* === BOTÓN DE CERRAR SESIÓN === */}
      <button
        className="btn"
        style={{ float: "right", backgroundColor: "#dc2626", color: "#fff" }}
        onClick={() => {
          localStorage.removeItem("usuarioActivo");
          window.location.href = "/";
        }}
      >
        Cerrar sesión
      </button>

      <div className="card">
        <h2>Panel PROVEEDOR</h2>
        <p className="small">
          Administra tus datos, verifica tus consolidaciones y estados de disponibilidad.
        </p>
      </div>

      {/* === FORMULARIO === */}
      <div className="card">
        <h3>{editMode ? "Editar proveedor" : "Registrar nuevo proveedor"}</h3>
        <form onSubmit={handleSubmit} className="row">
          <input
            placeholder="Nombre"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
          <input
            placeholder="Contacto"
            value={form.contact}
            onChange={(e) => setForm({ ...form, contact: e.target.value })}
            required
          />
          <input
            placeholder="Zonas (ej: Zona Norte, Zona Centro)"
            value={form.zones}
            onChange={(e) => setForm({ ...form, zones: e.target.value })}
            required
          />
          <button className="btn">
            {editMode ? "Actualizar" : "Crear proveedor"}
          </button>
          {editMode && (
            <button
              type="button"
              className="btn bg-gray"
              onClick={() => {
                setEditMode(false);
                setForm({ name: "", contact: "", zones: "" });
              }}
            >
              Cancelar
            </button>
          )}
        </form>
      </div>

      {/* === LISTA DE PROVEEDORES === */}
      <div className="card">
        <h3>Lista de Proveedores</h3>
        {proveedores.length === 0 ? (
          <p className="small">No hay proveedores registrados.</p>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Contacto</th>
                <th>Zonas</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {proveedores.map((p) => (
                <tr key={p._id}>
                  <td>{p.name}</td>
                  <td>{p.contact}</td>
                  <td>{p.zones?.join(", ") || "—"}</td>
                  <td>
                    {p.available ? (
                      <span className="badge bg-green">🟩 Disponible</span>
                    ) : (
                      <span className="badge bg-red">🟥 Ocupado</span>
                    )}
                  </td>
                  <td>
                    <button
                      className="btn small bg-yellow"
                      onClick={() => handleEdit(p)}
                    >
                      Editar
                    </button>
                    <button
                      className="btn small bg-red"
                      onClick={() => handleDelete(p._id)}
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

      {/* === CONSOLIDACIONES === */}
      <ConsolidationsTable
        items={conss}
        actions={{
          onDispatch: dispatch,
          onDelivered: delivered,
        }}
      />

      {/* === LISTA DE PROVEEDORES DISPONIBLES === */}
      <div className="card">
        <h3>Proveedores disponibles</h3>
        <ul className="small">
          {proveedores
            .filter((p) => p.available)
            .map((p) => (
              <li key={p._id}>
                {p.name} — {p.contact} —{" "}
                <strong>{p.zones?.join(", ")}</strong>
              </li>
            ))}
        </ul>
        {proveedores.filter((p) => p.available).length === 0 && (
          <p className="small">Ningún proveedor está disponible ahora.</p>
        )}
      </div>
    </>
  );
}
