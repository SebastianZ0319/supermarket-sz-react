import { Plus } from 'lucide-react'
import { precioCop } from '../utils/preciCop'
import { STOCK_BAJO } from '../utils/tienda'
import Stepper from './Stepper'

function ProductCard({ producto, categoria, enCarrito, agregarAlCarrito, disminuirDelCarrito }) {
  const agotado = producto.stock <= 0
  const stockBajo = !agotado && producto.stock <= STOCK_BAJO

  return (
    <li className={`card ${agotado ? 'agotada' : ''}`}>
      <div className="card-img">
        <img src={producto.imagen} alt={producto.nombre} loading="lazy" />
        {agotado && <span className="etiqueta etiqueta-gris">Agotado</span>}
        {stockBajo && <span className="etiqueta etiqueta-naranja">¡Últimas {producto.stock}!</span>}
      </div>

      <div className="card-cuerpo">
        <span className="card-categoria">{categoria}</span>
        <h3 className="card-nombre">{producto.nombre}</h3>
        <span className="card-stock">{agotado ? 'Sin unidades' : `${producto.stock} ${producto.stock === 1 ? 'disponible' : 'disponibles'}`}</span>
      </div>

      <div className="card-pie">
        <span className="card-precio">{precioCop.format(producto.precio)}</span>

        {enCarrito > 0 ? (
          <Stepper
            compacto
            nombre={producto.nombre}
            cantidad={enCarrito}
            puedeSumar={!agotado}
            sumar={() => agregarAlCarrito(producto)}
            restar={() => disminuirDelCarrito(producto.id)}
          />
        ) : (
          <button
            className="boton-agregar"
            disabled={agotado}
            onClick={() => agregarAlCarrito(producto)}
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
