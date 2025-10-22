import { useState } from "react";
import Swal from "sweetalert2";
import { api } from "../api/client";

export default function ProductsList({ products, onToggle }) {
  const [stockInput, setStockInput] = useState({});

  const handleAddStock = async (id) => {
    const amount = Number(stockInput[id]);
    if (!amount || amount <= 0) {
      Swal.fire("Error", "Ingresa una cantidad válida para agregar al stock", "error");
      return;
    }

    try {
      await api.addStock(id, amount);
      Swal.fire("Stock actualizado", `Se agregaron ${amount} unidades ✅`, "success");
      setStockInput((prev) => ({ ...prev, [id]: "" }));
      window.location.reload();
    } catch (err) {
      Swal.fire("Error", err.message, "error");
    }
  };

  return (
    <div className="card">
      <h3>Catálogo de productos</h3>
      <table>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>SKU</th>
            <th>Precio</th>
            <th>Stock</th>
            <th>Activo</th>
            {onToggle && <th>Acciones</th>}
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p._id}>
              <td>{p.name}</td>
              <td className="small">{p.sku}</td>
              <td>$ {p.price}</td>

              {/* === STOCK === */}
              <td>
                {p.stock > 0 ? (
                  <span className="badge bg-green">{p.stock}</span>
                ) : (
                  <span className="badge bg-gray">0</span>
                )}
              </td>

              {/* === ACTIVO / AGOTADO === */}
              <td>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  {/* Mostrar solo “Agotado” si no hay stock */}
                  {p.stock <= 0 ? (
                    <span
                      className="badge bg-red"
                      style={{
                        fontSize: "0.8rem",
                        opacity: 0.95,
                      }}
                    >
                      Agotado
                    </span>
                  ) : (
                    <span
                      className={`badge ${p.active ? "bg-green" : "bg-gray"}`}
                    >
                      {p.active ? "Sí" : "No"}
                    </span>
                  )}
                </div>
              </td>

              {/* === ACCIONES SOLO EN PLATAFORMA === */}
              {onToggle && (
                <td>
                  <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                    <button className="btn" onClick={() => onToggle(p._id)}>
                      Activar/Desactivar
                    </button>

                    {/* 🔹 Campo para agregar stock solo en plataforma */}
                    <div className="row" style={{ alignItems: "center" }}>
                      <input
                        type="number"
                        placeholder="Agregar stock"
                        value={stockInput[p._id] || ""}
                        onChange={(e) =>
                          setStockInput({ ...stockInput, [p._id]: e.target.value })
                        }
                        style={{
                          width: "90px",
                          marginRight: "5px",
                          padding: "2px 4px",
                          fontSize: "0.8rem",
                        }}
                      />
                      <button
                        className="btn small bg-blue"
                        onClick={() => handleAddStock(p._id)}
                      >
                        ➕
                      </button>
                    </div>
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
