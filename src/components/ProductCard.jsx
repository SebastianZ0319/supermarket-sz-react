import { Plus } from 'lucide-react'
import { plural, urlImagen } from '../utils/formato'
import { STOCK_BAJO, categoriaDe, porcentajeDescuento } from '../utils/tienda'
import Precio from './Precio'
import Stepper from './Stepper'

function ProductCard({ producto, enCarrito, agregar, restar, verDetalle }) {
  const agotado = producto.stock <= 0
  const quedan = producto.stock - enCarrito
  const stockBajo = !agotado && producto.stock <= STOCK_BAJO
  const descuento = porcentajeDescuento(producto)

  return (
    <li className={`card ${agotado ? 'agotada' : ''}`}>
      <button className="card-img" onClick={() => verDetalle(producto)} aria-label={`Ver detalle de ${producto.nombre}`}>
        <img src={urlImagen(producto.imagen)} alt="" loading="lazy" width="600" height="600" />
        <span className="card-etiquetas">
          {descuento > 0 && <span className="etiqueta etiqueta-roja">-{descuento}%</span>}
          {agotado && <span className="etiqueta etiqueta-gris">Agotado</span>}
          {stockBajo && <span className="etiqueta etiqueta-naranja">¡Últimas {producto.stock}!</span>}
        </span>
      </button>

      <div className="card-cuerpo">
        <span className="card-categoria">{categoriaDe(producto)}</span>
        <h3 className="card-nombre">
          <button onClick={() => verDetalle(producto)}>{producto.nombre}</button>
        </h3>
        <span className="card-stock">{agotado ? 'Sin unidades' : plural(producto.stock, 'disponible')}</span>
      </div>

      <div className="card-pie">
        <Precio producto={producto} />

        {enCarrito > 0 ? (
          <Stepper
            compacto
            nombre={producto.nombre}
            cantidad={enCarrito}
            puedeSumar={quedan > 0}
            sumar={() => agregar(producto)}
            restar={() => restar(producto.id)}
          />
        ) : (
          <button
            className="boton-agregar"
            disabled={agotado}
            onClick={() => agregar(producto)}
            aria-label={`Agregar ${producto.nombre} al carrito`}
          >
            <Plus size={20} />
          </button>
        )}
      </div>
    </li>
  )
}

export default ProductCard
