import './App.css'
import { Route, Routes } from 'react-router'
import Layout from './components/Layout'
import Tienda from './pages/Tienda'
import Checkout from './pages/Checkout'
import Confirmacion from './pages/Confirmacion'
import Admin from './pages/Admin'
import NoEncontrada from './pages/NoEncontrada'

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Tienda />} />
        <Route path="checkout" element={<Checkout />} />
        <Route path="pedido-confirmado" element={<Confirmacion />} />
        <Route path="*" element={<NoEncontrada />} />
      </Route>
      <Route path="admin" element={<Admin />} />
    </Routes>
  )
}

export default App
