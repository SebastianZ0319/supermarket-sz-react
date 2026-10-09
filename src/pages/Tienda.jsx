import { useCallback } from 'react'
import { useSearchParams } from 'react-router'
import { useTienda } from '../context/TiendaContext'
import Hero from '../components/Hero'
import Catalogo from '../components/Catalogo'
import DetalleProducto from '../components/DetalleProducto'

function Tienda() {
  const { productos } = useTienda()
  const [params, setParams] = useSearchParams()

  // El producto abierto va en la URL (?producto=3): el botón "atrás" del celular cierra el detalle
  const idDetalle = Number(params.get('producto'))
  const detalle = productos.find((p) => p.id === idDetalle) ?? null

  const verDetalle = useCallback(
    (producto) => {
      setParams((actuales) => {
        const nuevos = new URLSearchParams(actuales)
        nuevos.set('producto', producto.id)
        return nuevos
      }, { preventScrollReset: true })
    },
    [setParams]
  )

  const cerrarDetalle = useCallback(() => {
    setParams((actuales) => {
      const nuevos = new URLSearchParams(actuales)
      nuevos.delete('producto')
      return nuevos
    }, { preventScrollReset: true })
  }, [setParams])

  return (
    <>
      <Hero />
      <Catalogo verDetalle={verDetalle} />
      <DetalleProducto producto={detalle} cerrar={cerrarDetalle} />
    </>
  )
}

export default Tienda
