import { useEffect } from 'react'
import { useNavigate } from 'react-router'
import { ArrowRight, ShoppingBag, X } from 'lucide-react'
import { useTienda } from '../context/TiendaContext'
import { precioCop, urlImagen } from '../utils/formato'
import BarraEnvio from './BarraEnvio'
import ResumenPedido from './ResumenPedido'
import Stepper from './Stepper'

function PanelCarrito() {
  const {
    panelAbierto: abierto,
    cerrarCarrito: cerrar,
    carrito,
    productos,
    cantidad,
    subtotal,
    agregar,
    restar,
    quitar,
    vaciar,
  } = useTienda()
  const navegar = useNavigate()

  // Bloquea el scroll de la página y permite cerrar con Escape
  useEffect(() => {
    if (!abierto) return
    const cerrarConEscape = (e) => e.key === 'Escape' && cerrar()
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', cerrarConEscape)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', cerrarConEscape)
    }
  }, [abierto, cerrar])

  const vacio = carrito.length === 0

  function irAPagar() {
    cerrar()
    navegar('/checkout')
  }

  return (
    <>
      <div className={`overlay ${abierto ? 'abierto' : ''}`} onClick={cerrar} />

      <aside
        className={`panel ${abierto ? 'abierto' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label="Carrito de compras"
        aria-hidden={!abierto}
        inert={!abierto}
      >
        <div className="panel-header">
          <h2>
            Tu carrito <span className="texto-suave">({cantidad})</span>
          </h2>
          <button className="boton-icono" onClick={cerrar} aria-label="Cerrar carrito">
            <X size={20} />
          </button>
        </div>

        {vacio ? (
          <div className="estado-vacio panel-vacio">
            <ShoppingBag size={44} />
            <h3>Tu carrito está vacío</h3>
            <p>Agrega productos para empezar tu compra.</p>
            <button className="boton boton-primario" onClick={cerrar}>
              Seguir comprando
            </button>
          </div>
        ) : (
          <>
            <BarraEnvio subtotal={subtotal} />

            <ul className="panel-lista">
              {carrito.map((item) => {
                const stock = productos.find((p) => p.id === item.id)?.stock ?? item.cantidad
                return (
                  <li key={item.id} className="item">
                    <div className="item-img">
                      <img src={urlImagen(item.imagen)} alt="" />
                    </div>
                    <div className="item-info">
                      <div className="item-fila">
                        <span className="item-nombre">{item.nombre}</span>
                        <button className="item-quitar" onClick={() => quitar(item.id)} aria-label={`Quitar ${item.nombre}`}>
                          <X size={16} />
                        </button>
                      </div>
                      <span className="texto-suave">{precioCop.format(item.precio)} c/u</span>
                      <div className="item-fila">
                        <Stepper
                          compacto
                          nombre={item.nombre}
                          cantidad={item.cantidad}
                          puedeSumar={item.cantidad < stock}
                          sumar={() => agregar(item)}
                          restar={() => restar(item.id)}
                        />
                        <strong>{precioCop.format(item.precio * item.cantidad)}</strong>
                      </div>
                    </div>
                  </li>
                )
              })}
            </ul>

            <div className="panel-pie">
              <ResumenPedido subtotal={subtotal} />
              <button className="boton boton-primario boton-grande boton-bloque" onClick={irAPagar}>
                Ir a pagar <ArrowRight size={18} />
              </button>
              <button className="boton-texto" onClick={vaciar}>
                Vaciar carrito
              </button>
            </div>
          </>
        )}
      </aside>
    </>
  )
}

export default PanelCarrito
