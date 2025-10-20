export default function ProductsList({ products, onToggle }){
  return (
    <div className="card">
      <h3>Catálogo de productos</h3>
      <table>
        <thead><tr><th>Nombre</th><th>SKU</th><th>Precio</th><th>Activo</th><th></th></tr></thead>
        <tbody>
          {products.map(p=>(
            <tr key={p._id}>
              <td>{p.name}</td>
              <td className="small">{p.sku}</td>
              <td>$ {p.price}</td>
              <td><span className="badge">{p.active ? 'Sí' : 'No'}</span></td>
              {onToggle && <td><button className="btn" onClick={()=>onToggle(p._id)}>Activar/Desactivar</button></td>}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
