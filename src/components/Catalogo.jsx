import { useMemo } from 'react'
import { useSearchParams } from 'react-router'
import { PackageSearch, RefreshCw, WifiOff } from 'lucide-react'
import { useTienda } from '../context/TiendaContext'
import { plural } from '../utils/formato'
import { CATEGORIAS, enOferta, filtrarProductos } from '../utils/tienda'
import ProductCard from './ProductCard'

const ORDENES = {
  relevancia: 'Destacados',
  'precio-asc': 'Menor precio',
  'precio-desc': 'Mayor precio',
  nombre: 'Nombre (A-Z)',
}

function Catalogo({ verDetalle }) {
  const { productos, estado, recargarProductos, enCarrito, agregar, restar } = useTienda()
  const [params, setParams] = useSearchParams()

  // Filtros en la URL: se pueden compartir y sobreviven a recargar la página
  const busqueda = params.get('q') ?? ''
  const categoria = params.get('categoria') ?? 'Todos'
  const orden = params.get('orden') ?? 'relevancia'

  function cambiarFiltro(clave, valor, porDefecto) {
    const nuevos = new URLSearchParams(params)
    if (valor === porDefecto) nuevos.delete(clave)
    else nuevos.set(clave, valor)
    setParams(nuevos, { replace: true, preventScrollReset: true })
  }

  const hayOfertas = productos.some(enOferta)
  const categorias = ['Todos', ...(hayOfertas ? ['Ofertas'] : []), ...CATEGORIAS]

  const visibles = useMemo(
    () => filtrarProductos(productos, { busqueda, categoria, orden }),
    [productos, busqueda, categoria, orden]
  )

  return (
    <section id="catalogo" className="catalogo contenedor">
      <div className="catalogo-encabezado">
        <div>
          <h2>{busqueda ? `Resultados para “${busqueda}”` : 'Productos'}</h2>
          {estado === 'listo' && <p className="texto-suave">{plural(visibles.length, 'producto')}</p>}
        </div>

        <label className="selector">
          <span className="sr-only">Ordenar por</span>
          <select value={orden} onChange={(e) => cambiarFiltro('orden', e.target.value, 'relevancia')}>
            {Object.entries(ORDENES).map(([valor, texto]) => (
              <option key={valor} value={valor}>
                {texto}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="chips" role="group" aria-label="Categorías">
        {categorias.map((c) => (
          <button
            key={c}
            aria-pressed={categoria === c}
            className={`chip ${categoria === c ? 'activo' : ''} ${c === 'Ofertas' ? 'chip-oferta' : ''}`}
            onClick={() => cambiarFiltro('categoria', c, 'Todos')}
          >
            {c}
          </button>
        ))}
      </div>

      {estado === 'cargando' && (
        <ul className="grilla" aria-busy="true" aria-label="Cargando productos">
          {Array.from({ length: 8 }, (_, i) => (
            <li key={i} className="card card-esqueleto">
              <div className="esqueleto esqueleto-img" />
              <div className="esqueleto esqueleto-linea" />
              <div className="esqueleto esqueleto-linea corta" />
              <div className="esqueleto esqueleto-boton" />
            </li>
          ))}
        </ul>
      )}

      {estado === 'error' && (
        <div className="estado-vacio">
          <WifiOff size={40} />
          <h3>No pudimos cargar los productos</h3>
          <p>Revisa que el servidor esté encendido e inténtalo de nuevo.</p>
          <button className="boton boton-primario" onClick={recargarProductos}>
            <RefreshCw size={16} /> Reintentar
          </button>
        </div>
      )}

      {estado === 'listo' && visibles.length === 0 && (
        <div className="estado-vacio">
          <PackageSearch size={40} />
          <h3>No encontramos productos</h3>
          <p>Prueba con otra búsqueda o categoría.</p>
          <button className="boton boton-secundario" onClick={() => setParams({}, { replace: true })}>
            Limpiar filtros
          </button>
        </div>
      )}

      {estado === 'listo' && visibles.length > 0 && (
        <ul className="grilla">
          {visibles.map((producto) => (
            <ProductCard
              key={producto.id}
              producto={producto}
              enCarrito={enCarrito(producto.id)}
              agregar={agregar}
              restar={restar}
              verDetalle={verDetalle}
            />
          ))}
        </ul>
      )}
    </section>
  )
}

export default Catalogo
