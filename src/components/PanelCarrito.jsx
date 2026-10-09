import { useEffect } from 'react'
import { ShoppingBag, Truck, X } from 'lucide-react'
import { precioCop } from '../utils/preciCop'
import { COSTO_ENVIO, ENVIO_GRATIS_DESDE } from '../utils/tienda'
import Stepper from './Stepper'

function PanelCarrito({
  abierto,
  cerrar,
  carrito,
  productos,
  subtotal,
  cantidad,
  agregarAlCarrito,
  disminuirDelCarrito,
  quitarDelCarrito,
  vaciarCarrito,
  pagar,
}) {
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
  const envioGratis = subtotal >= ENVIO_GRATIS_DESDE
  const envio = vacio || envioGratis ? 0 : COSTO_ENVIO
  const progreso = Math.min(100, (subtotal / ENVIO_GRATIS_DESDE) * 100)

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
            <div className="envio">
              <p>
                <Truck size={16} aria-hidden="true" />
                {envioGratis ? (
                  <span>
                    ¡Tienes <strong>envío gratis</strong>!
                  </span>
                ) : (
                  <span>
                    Te faltan <strong>{precioCop.format(ENVIO_GRATIS_DESDE - subtotal)}</strong> para envío gratis
                  </span>
                )}
              </p>
              <div className="envio-barra">
                <div style={{ width: `${progreso}%` }} />
              </div>
            </div>

            <ul className="panel-lista">
              {carrito.map((item) => {
                const stock = productos.find((p) => p.id === item.id)?.stock ?? 0
                return (
                  <li key={item.id} className="item">
                    <div className="item-img">
                      <img src={item.imagen} alt={item.nombre} />
                    </div>
                    <div className="item-info">
                      <div className="item-fila">
                        <span className="item-nombre">{item.nombre}</span>
                        <button
                          className="item-quitar"
                          onClick={() => quitarDelCarrito(item.id)}
                          aria-label={`Quitar ${item.nombre}`}
                        >
                          <X size={16} />
                        </button>
                      </div>
                      <span className="texto-suave">{precioCop.format(item.precio)} c/u</span>
                      <div className="item-fila">
                        <Stepper
                          compacto
                          nombre={item.nombre}
                          cantidad={item.cantidad}
                          puedeSumar={stock > 0}
                          sumar={() => agregarAlCarrito(item)}
                          restar={() => disminuirDelCarrito(item.id)}
                        />
                        <strong>{precioCop.format(item.precio * item.cantidad)}</strong>
                      </div>
                    </div>
                  </li>
                )
              })}
            </ul>

            <div className="panel-pie">
              <dl className="resumen">
                <div>
                  <dt>Subtotal</dt>
                  <dd>{precioCop.format(subtotal)}</dd>
                </div>
                <div>
                  <dt>Envío</dt>
                  <dd className={envio === 0 ? 'texto-verde' : ''}>
                    {envio === 0 ? 'Gratis' : precioCop.format(envio)}
                  </dd>
                </div>
                <div className="resumen-total">
                  <dt>Total</dt>
                  <dd>{precioCop.format(subtotal + envio)}</dd>
                </div>
              </dl>
              <button className="boton boton-primario boton-grande boton-bloque" onClick={pagar}>
                Pagar {precioCop.format(subtotal + envio)}
              </button>
              <button className="boton-texto" onClick={vaciarCarrito}>
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
