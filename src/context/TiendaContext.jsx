import { createContext, useCallback, useContext, useEffect, useMemo, useReducer, useState } from 'react'
import { toast } from 'sonner'
import { api } from '../api/cliente'
import { carritoReducer, leerCarritoGuardado, resumenCarrito } from '../utils/carrito'

const TiendaContext = createContext(null)

export function TiendaProvider({ children }) {
  const [productos, setProductos] = useState([])
  const [estado, setEstado] = useState('cargando') // cargando | listo | error
  const [carrito, despachar] = useReducer(carritoReducer, undefined, leerCarritoGuardado)
  const [panelAbierto, setPanelAbierto] = useState(false)

  // El estado solo se actualiza cuando llega la respuesta, nunca de forma síncrona
  const pedirProductos = useCallback(
    () =>
      api.productos().then(
        (datos) => {
          setProductos(datos)
          despachar({ tipo: 'sincronizar', productos: datos })
          setEstado('listo')
          return datos
        },
        () => {
          setEstado('error')
          return null
        }
      ),
    []
  )

  const recargarProductos = useCallback(() => {
    setEstado((actual) => (actual === 'error' ? 'cargando' : actual))
    return pedirProductos()
  }, [pedirProductos])

  useEffect(() => {
    pedirProductos()
  }, [pedirProductos])

  useEffect(() => {
    localStorage.setItem('carrito', JSON.stringify(carrito))
  }, [carrito])

  const enCarrito = useCallback((id) => carrito.find((i) => i.id === id)?.cantidad ?? 0, [carrito])

  const acciones = useMemo(
    () => ({
      agregar(producto) {
        const actual = productos.find((p) => p.id === producto.id) ?? producto
        const cantidad = carrito.find((i) => i.id === producto.id)?.cantidad ?? 0
        if (cantidad >= actual.stock) {
          toast.warning(`Solo hay ${actual.stock} unidades de ${actual.nombre}`)
          return
        }
        despachar({ tipo: 'agregar', producto: actual })
        if (cantidad === 0) toast.success(`${actual.nombre} agregado al carrito`)
      },
      restar: (id) => despachar({ tipo: 'restar', id }),
      quitar(id) {
        const item = carrito.find((i) => i.id === id)
        despachar({ tipo: 'quitar', id })
        if (item) toast.info(`Quitaste ${item.nombre} del carrito`)
      },
      vaciar: () => despachar({ tipo: 'vaciar' }),
      sincronizar: (lista) => despachar({ tipo: 'sincronizar', productos: lista }),
    }),
    [productos, carrito]
  )

  const abrirCarrito = useCallback(() => setPanelAbierto(true), [])
  const cerrarCarrito = useCallback(() => setPanelAbierto(false), [])

  const valor = {
    productos,
    estado,
    recargarProductos,
    carrito,
    ...resumenCarrito(carrito),
    enCarrito,
    ...acciones,
    panelAbierto,
    abrirCarrito,
    cerrarCarrito,
  }

  return <TiendaContext.Provider value={valor}>{children}</TiendaContext.Provider>
}

export function useTienda() {
  const contexto = useContext(TiendaContext)
  if (!contexto) throw new Error('useTienda debe usarse dentro de <TiendaProvider>')
  return contexto
}
