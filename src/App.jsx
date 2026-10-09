import './App.css'
import { useState, useEffect, useCallback } from 'react'
import { Toaster, toast } from 'sonner'
import Header from './components/Header'
import Hero from './components/Hero'
import Catalogo from './components/Catalogo'
import PanelCarrito from './components/PanelCarrito'
import BarraCarritoMovil from './components/BarraCarritoMovil'
import Footer from './components/Footer'
import { API_PRODUCTOS } from './utils/tienda'

function App() {
  const [productos, setProductos] = useState([])
  const [estado, setEstado] = useState('cargando') // cargando | listo | error
  const [busqueda, setBusqueda] = useState('')
  const [panelAbierto, setPanelAbierto] = useState(false)

  const [carrito, setCarrito] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('carrito')) ?? []
    } catch {
      return []
    }
  })

  const abrirCarrito = useCallback(() => setPanelAbierto(true), [])
  const cerrarCarrito = useCallback(() => setPanelAbierto(false), [])

  const cargarProductos = useCallback(() => {
    fetch(API_PRODUCTOS)
      .then((respuesta) => {
        if (!respuesta.ok) throw new Error('Respuesta inválida')
        return respuesta.json()
      })
      .then((datos) => {
        setProductos(datos)
        setEstado('listo')
      })
      .catch(() => setEstado('error'))
  }, [])

  useEffect(() => {
    cargarProductos()
  }, [cargarProductos])

  function reintentar() {
    setEstado('cargando')
    cargarProductos()
  }

  useEffect(() => {
    localStorage.setItem('carrito', JSON.stringify(carrito))
  }, [carrito])

  // Ajusta el stock en pantalla y lo sincroniza con el backend
  function cambiarStock(id, delta) {
    const producto = productos.find((p) => p.id === id)
    if (!producto) return
    setProductos((prev) => prev.map((p) => (p.id === id ? { ...p, stock: p.stock + delta } : p)))
    fetch(`${API_PRODUCTOS}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ stock: producto.stock + delta }),
    }).catch(() => toast.error('No se pudo actualizar el stock en el servidor'))
  }

  function agregarAlCarrito(producto) {
    const actual = productos.find((p) => p.id === producto.id)
    if (!actual || actual.stock <= 0) return
    const esNuevo = !carrito.some((item) => item.id === producto.id)

    setCarrito((prev) => {
      if (prev.some((item) => item.id === producto.id)) {
        return prev.map((item) =>
          item.id === producto.id ? { ...item, cantidad: item.cantidad + 1 } : item
        )
      }
      const { id, nombre, precio, imagen } = producto
      return [...prev, { id, nombre, precio, imagen, cantidad: 1 }]
    })
    cambiarStock(producto.id, -1)
    // Solo se notifica la primera vez; los "+" siguientes se ven en el contador
    if (esNuevo) toast.success(`${producto.nombre} agregado al carrito`)
  }

  function disminuirDelCarrito(id) {
    const item = carrito.find((i) => i.id === id)
    if (!item) return
    setCarrito((prev) =>
      item.cantidad > 1
        ? prev.map((i) => (i.id === id ? { ...i, cantidad: i.cantidad - 1 } : i))
        : prev.filter((i) => i.id !== id)
    )
    cambiarStock(id, 1)
  }

  function quitarDelCarrito(id) {
    const item = carrito.find((i) => i.id === id)
    if (!item) return
    setCarrito((prev) => prev.filter((i) => i.id !== id))
    cambiarStock(id, item.cantidad)
    toast.info(`Quitaste ${item.nombre} del carrito`)
  }

  function vaciarCarrito() {
    carrito.forEach((item) => cambiarStock(item.id, item.cantidad))
    setCarrito([])
    toast.info('Vaciaste tu carrito')
  }

  function pagar() {
    // El stock ya se descontó al agregar, así que solo se limpia el carrito
    setCarrito([])
    setPanelAbierto(false)
    toast.success('¡Compra exitosa! Gracias por comprar en Supermarket SZ')
  }

  const cantidadTotal = carrito.reduce((acc, item) => acc + item.cantidad, 0)
  const subtotal = carrito.reduce((acc, item) => acc + item.precio * item.cantidad, 0)

  return (
    <>
      <Toaster position="top-center" richColors closeButton />

      <Header
        busqueda={busqueda}
        setBusqueda={setBusqueda}
        cantidad={cantidadTotal}
        subtotal={subtotal}
        abrirCarrito={abrirCarrito}
      />

      <main>
        <Hero />
        <Catalogo
          productos={productos}
          estado={estado}
          reintentar={reintentar}
          busqueda={busqueda}
          setBusqueda={setBusqueda}
          carrito={carrito}
          agregarAlCarrito={agregarAlCarrito}
          disminuirDelCarrito={disminuirDelCarrito}
        />
      </main>

      <Footer />

      <BarraCarritoMovil
        cantidad={cantidadTotal}
        subtotal={subtotal}
        abrirCarrito={abrirCarrito}
      />

      <PanelCarrito
        abierto={panelAbierto}
        cerrar={cerrarCarrito}
        carrito={carrito}
        productos={productos}
        subtotal={subtotal}
        cantidad={cantidadTotal}
        agregarAlCarrito={agregarAlCarrito}
        disminuirDelCarrito={disminuirDelCarrito}
        quitarDelCarrito={quitarDelCarrito}
        vaciarCarrito={vaciarCarrito}
        pagar={pagar}
      />
    </>
  )
}

export default App
