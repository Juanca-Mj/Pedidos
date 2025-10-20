import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './styles.css'
import App from './App.jsx'
import TenderoPage from './pages/TenderoPage.jsx'
import PlataformaPage from './pages/PlataformaPage.jsx'
import ProveedorPage from './pages/ProveedorPage.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App/>}>
          <Route index element={<TenderoPage/>}/>
          <Route path="plataforma" element={<PlataformaPage/>}/>
          <Route path="proveedor" element={<ProveedorPage/>}/>
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
)
