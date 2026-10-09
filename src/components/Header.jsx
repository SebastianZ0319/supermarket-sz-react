import { Search, ShoppingBag, Truck, X } from 'lucide-react'
import { precioCop } from '../utils/preciCop'
import { ENVIO_GRATIS_DESDE } from '../utils/tienda'

function Header({ busqueda, setBusqueda, cantidad, subtotal, abrirCarrito }) {
  return (
    <header className="header">
      <div className="anuncio">
        <Truck size={16} aria-hidden="true" />
        <span>Envío gratis en compras desde {precioCop.format(ENVIO_GRATIS_DESDE)}</span>
      </div>

      <div className="header-principal contenedor">
        <a href="#" className="marca" aria-label="Supermarket SZ, inicio">
          <img src="Fotos/Logo.png" alt="" className="marca-logo" />
          <span className="marca-nombre">
            Supermarket <strong>SZ</strong>
          </span>
        </a>

        <label className="buscador">
          <Search size={18} className="buscador-icono" aria-hidden="true" />
          <input
            type="search"
            placeholder="Buscar productos…"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            aria-label="Buscar productos"
          />
          {busqueda && (
            <button className="buscador-limpiar" onClick={() => setBusqueda('')} aria-label="Limpiar búsqueda">
              <X size={16} />
            </button>
          )}
        </label>

        <button className="boton-carrito" onClick={abrirCarrito} aria-label={`Abrir carrito, ${cantidad} productos`}>
          <span className="boton-carrito-icono">
            <ShoppingBag size={22} />
            {cantidad > 0 && (
              <span key={cantidad} className="contador">
                {cantidad}
              </span>
            )}
          </span>
          <span className="boton-carrito-texto">
            <small>Mi carrito</small>
            <strong>{precioCop.format(subtotal)}</strong>
          </span>
        </button>
      </div>
    </header>
  )
}

export default Header
