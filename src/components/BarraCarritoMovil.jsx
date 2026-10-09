import { ChevronRight, ShoppingBag } from 'lucide-react'
import { useTienda } from '../context/TiendaContext'
import { precioCop } from '../utils/formato'

// Solo visible en celular y cuando hay productos en el carrito
function BarraCarritoMovil() {
  const { cantidad, subtotal, abrirCarrito } = useTienda()

  return (
    <div className={`barra-movil ${cantidad > 0 ? 'visible' : ''}`}>
      <button onClick={abrirCarrito} tabIndex={cantidad > 0 ? 0 : -1}>
        <span className="barra-movil-cantidad">
          <ShoppingBag size={18} />
          {cantidad}
        </span>
        <span>Ver carrito</span>
        <span className="barra-movil-total">
          {precioCop.format(subtotal)}
          <ChevronRight size={18} />
        </span>
      </button>
    </div>
  )
}

export default BarraCarritoMovil
