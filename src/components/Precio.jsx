import { precioCop } from '../utils/formato'
import { enOferta } from '../utils/tienda'

// Precio actual y, si hay oferta, el precio anterior tachado
function Precio({ producto, grande = false }) {
  return (
    <span className={`precio ${grande ? 'precio-grande' : ''}`}>
      <span className={`precio-actual ${enOferta(producto) ? 'precio-oferta' : ''}`}>
        {precioCop.format(producto.precio)}
      </span>
      {enOferta(producto) && (
        <s className="precio-anterior">
          <span className="sr-only">Antes </span>
          {precioCop.format(producto.precioAnterior)}
        </s>
      )}
    </span>
  )
}

export default Precio
