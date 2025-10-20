import { useState } from "react";

export default function AssignProviderForm({ providers, onAssign }){
  const [providerId, setProviderId] = useState(providers[0]?._id || '');

  return (
    <div className="row">
      <select value={providerId} onChange={e=>setProviderId(e.target.value)}>
        {providers.map(p=><option key={p._id} value={p._id}>{p.name}</option>)}
      </select>
      <button className="btn" onClick={()=>onAssign(providerId)}>Asignar</button>
    </div>
  )
}
