export default function OrdersTable({ orders, onMarkReceived }){
  return (
    <div className="card">
      <h3>Pedidos</h3>
      <table>
        <thead><tr><th>Tienda</th><th>Zona</th><th>Estado</th><th>Ítems</th><th>Recibido</th><th></th></tr></thead>
        <tbody>
          {orders.map(o=>(
            <tr key={o._id}>
              <td>{o.store_id?.name || o.store_id}</td>
              <td>{o.zone}</td>
              <td><span className="badge">{o.status}</span></td>
              <td className="small">
                {o.items.map(i=>`${i.product_name} x ${i.quantity}`).join(", ")}
              </td>
              <td>{o.received ? '✅' : '—'}</td>
              <td>
                {onMarkReceived && o.status==='entregado' && !o.received && (
                  <button className="btn" onClick={()=>onMarkReceived(o._id)}>Marcar recibido</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
