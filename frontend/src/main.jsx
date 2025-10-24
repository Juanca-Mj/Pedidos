import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './styles.css'
import App from './App.jsx'
import LoginPage from './pages/login.jsx'
import TenderoPage from './pages/TenderoPage.jsx'
import PlataformaPage from './pages/PlataformaPage.jsx'
import ProveedorPage from './pages/ProveedorPage.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/tendero" element={<App />}>
          <Route index element={<TenderoPage />} />
        </Route>
        <Route path="/plataforma" element={<App />}>
          <Route index element={<PlataformaPage />} />
        </Route>
        <Route path="/proveedor" element={<App />}>
          <Route index element={<ProveedorPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
);
