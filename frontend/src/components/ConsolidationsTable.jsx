export default function ConsolidationsTable({ items, actions={} }){
  const { onAssign, onDispatch, onDelivered } = actions;
  return (
    <div className="card">
      <h3>Consolidaciones</h3>
      <table>
        <thead><tr><th>Zona</th><th>Estado</th><th>Proveedor</th><th>Productos</th><th>Acciones</th></tr></thead>
        <tbody>
          {items.map(c=>(
            <tr key={c._id}>
              <td>{c.zone}</td>
              <td><span className="badge">{c.status}</span></td>
              <td>{c.provider_id?.name || '—'}</td>
              <td className="small">
                {c.items.map(i=>`${i.product_name} x ${i.total_quantity}`).join(", ")}
              </td>
              <td className="row">
                {onAssign && c.status==='en_consolidacion' && <button className="btn" onClick={()=>onAssign(c)}>Asignar proveedor</button>}
                {onDispatch && c.status==='en_asignacion' && <button className="btn" onClick={()=>onDispatch(c)}>Despachar</button>}
                {onDelivered && c.status==='en_despacho' && <button className="btn" onClick={()=>onDelivered(c)}>Marcar entregado</button>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
