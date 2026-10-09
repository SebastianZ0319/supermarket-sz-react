import { ShoppingBag, Truck } from 'lucide-react'
import { useTienda } from '../context/TiendaContext'
import { plural, precioCop, urlImagen } from '../utils/formato'
import { ENVIO_GRATIS_DESDE, categoriaDe, porcentajeDescuento } from '../utils/tienda'
import Modal from './Modal'
import Precio from './Precio'
import Stepper from './Stepper'

function DetalleProducto({ producto, cerrar }) {
  const { enCarrito, agregar, restar, abrirCarrito } = useTienda()
  const cantidad = producto ? enCarrito(producto.id) : 0

  return (
    <Modal abierto={Boolean(producto)} cerrar={cerrar} titulo={producto?.nombre ?? ''} ancho={860} className="detalle">
      {producto && (
        <div className="detalle-contenido">
          <div className="detalle-img">
            <img src={urlImagen(producto.imagen)} alt={producto.nombre} width="600" height="600" />
            {porcentajeDescuento(producto) > 0 && (
              <span className="etiqueta etiqueta-roja detalle-descuento">-{porcentajeDescuento(producto)}%</span>
            )}
          </div>

          <div className="detalle-info">
            <span className="card-categoria">{categoriaDe(producto)}</span>
            <h2>{producto.nombre}</h2>
            <Precio producto={producto} grande />

            {producto.descripcion && <p className="detalle-descripcion">{producto.descripcion}</p>}

            <p className={`detalle-stock ${producto.stock === 0 ? 'sin-stock' : ''}`}>
              {producto.stock === 0 ? 'Agotado por ahora' : plural(producto.stock, 'unidad disponible', 'unidades disponibles')}
            </p>

            <div className="detalle-acciones">
              {cantidad > 0 ? (
                <>
                  <Stepper
                    nombre={producto.nombre}
                    cantidad={cantidad}
                    puedeSumar={cantidad < producto.stock}
                    sumar={() => agregar(producto)}
                    restar={() => restar(producto.id)}
                  />
                  <button
                    className="boton boton-secundario boton-grande"
                    onClick={() => {
                      cerrar()
                      abrirCarrito()
                    }}
                  >
                    <ShoppingBag size={18} /> Ver carrito
                  </button>
                </>
              ) : (
                <button
                  className="boton boton-primario boton-grande boton-bloque"
                  disabled={producto.stock === 0}
                  onClick={() => agregar(producto)}
                >
                  <ShoppingBag size={18} /> Agregar al carrito
                </button>
              )}
            </div>

            <p className="detalle-envio">
              <Truck size={16} aria-hidden="true" />
              Envío gratis desde {precioCop.format(ENVIO_GRATIS_DESDE)}
            </p>
          </div>
        </div>
      )}
    </Modal>
  )
}

export default DetalleProducto
