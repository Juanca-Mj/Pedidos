import { useEffect, useState } from "react";
import { api } from "../api/client";

export default function PendingOrdersTable() {
  const [pendingOrders, setPendingOrders] = useState([]);

  useEffect(() => {
    const loadPendingOrders = async () => {
      try {
        const orders = await api.listOrders();
        // Filter only pending orders
        const pending = orders.filter(order => order.status === "pendiente");
        setPendingOrders(pending);
      } catch (error) {
        console.error("Error loading pending orders:", error);
      }
    };

    loadPendingOrders();
    // Refresh every 30 seconds
    const interval = setInterval(loadPendingOrders, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="mt-6">
      <h2 className="text-xl font-bold mb-4">Pedidos Pendientes</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tienda</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Zona</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha y Hora</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {pendingOrders.map((order) => (
              <tr key={order._id}>
                <td className="px-6 py-4 whitespace-nowrap">{order.store_id.name}</td>
                <td className="px-6 py-4 whitespace-nowrap">{order.store_id.zone}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {new Date(order.created_at).toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                    Pendiente
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}