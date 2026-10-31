import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, HashRouter } from 'react-router'
import './index.css'
import App from './App.jsx'
import { TemaProvider } from './context/TemaContext'
import { TiendaProvider } from './context/TiendaContext'
import { MODO_DEMO } from './api/cliente'

const tienda = (
  <TemaProvider>
    <TiendaProvider>
      <App />
    </TiendaProvider>
  </TemaProvider>
)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* La demo vive en una subcarpeta de un hosting estático: con rutas # no hay 404 al recargar */}
    {MODO_DEMO ? <HashRouter>{tienda}</HashRouter> : <BrowserRouter>{tienda}</BrowserRouter>}
  </StrictMode>,
)
