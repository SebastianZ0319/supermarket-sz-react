import { Search, ShoppingBag, Truck, X } from 'lucide-react'
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router'
import { useTienda } from '../context/TiendaContext'
import { precioCop } from '../utils/formato'
import { ENVIO_GRATIS_DESDE } from '../utils/tienda'
import BotonTema from './BotonTema'
import Marca from './Marca'

function Header() {
  const { cantidad, subtotal, abrirCarrito } = useTienda()
  const [params, setParams] = useSearchParams()
  const { pathname } = useLocation()
  const navegar = useNavigate()
  const busqueda = params.get('q') ?? ''

  // La búsqueda vive en la URL (?q=) para poder compartirla y volver atrás
  function buscar(texto) {
    const nuevos = new URLSearchParams(pathname === '/' ? params : undefined)
    if (texto) nuevos.set('q', texto)
    else nuevos.delete('q')

    if (pathname === '/') setParams(nuevos, { replace: true })
    else navegar(`/?${nuevos}`)
  }

  return (
    <header className="header">
      <div className="anuncio">
        <Truck size={16} aria-hidden="true" />
        <span>Envío gratis en compras desde {precioCop.format(ENVIO_GRATIS_DESDE)}</span>
      </div>

      <div className="header-principal contenedor">
        <Link to="/" aria-label="Supermarket SZ, inicio">
          <Marca />
        </Link>

        <label className="buscador">
          <Search size={18} className="buscador-icono" aria-hidden="true" />
          <input
            type="search"
            placeholder="Buscar productos…"
            value={busqueda}
            onChange={(e) => buscar(e.target.value)}
            aria-label="Buscar productos"
          />
          {busqueda && (
            <button className="buscador-limpiar" onClick={() => buscar('')} aria-label="Limpiar búsqueda">
              <X size={16} />
            </button>
          )}
        </label>

        <div className="header-acciones">
          <BotonTema />
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
      </div>
    </header>
  )
}

export default Header
