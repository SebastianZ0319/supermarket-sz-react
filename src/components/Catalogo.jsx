import { useMemo, useState } from 'react'
import { PackageSearch, RefreshCw, WifiOff } from 'lucide-react'
import ProductCard from './ProductCard'
import { CATEGORIAS, categoriaDe, normalizar } from '../utils/tienda'

const ORDENES = {
  relevancia: 'Destacados',
  'precio-asc': 'Menor precio',
  'precio-desc': 'Mayor precio',
  nombre: 'Nombre (A-Z)',
}

function Catalogo({ productos, estado, reintentar, busqueda, setBusqueda, carrito, agregarAlCarrito, disminuirDelCarrito }) {
  const [categoria, setCategoria] = useState('Todos')
  const [orden, setOrden] = useState('relevancia')

  const visibles = useMemo(() => {
    const texto = normalizar(busqueda.trim())
    const filtrados = productos.filter(
      (p) =>
        (categoria === 'Todos' || categoriaDe(p) === categoria) &&
        normalizar(p.nombre).includes(texto)
    )
    const ordenados = [...filtrados]
    if (orden === 'precio-asc') ordenados.sort((a, b) => a.precio - b.precio)
    if (orden === 'precio-desc') ordenados.sort((a, b) => b.precio - a.precio)
    if (orden === 'nombre') ordenados.sort((a, b) => a.nombre.localeCompare(b.nombre, 'es'))
    return ordenados
  }, [productos, busqueda, categoria, orden])

  function limpiarFiltros() {
    setCategoria('Todos')
    setBusqueda('')
  }

  return (
    <section id="catalogo" className="catalogo contenedor">
      <div className="catalogo-encabezado">
        <div>
          <h2>Productos</h2>
          {estado === 'listo' && (
            <p className="texto-suave">
              {visibles.length} {visibles.length === 1 ? 'producto' : 'productos'}
            </p>
          )}
        </div>

        <label className="selector">
          <span className="sr-only">Ordenar por</span>
          <select value={orden} onChange={(e) => setOrden(e.target.value)}>
            {Object.entries(ORDENES).map(([valor, texto]) => (
              <option key={valor} value={valor}>
                {texto}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="chips" role="tablist" aria-label="Categorías">
        {CATEGORIAS.map((c) => (
          <button
            key={c}
            role="tab"
            aria-selected={categoria === c}
            className={`chip ${categoria === c ? 'activo' : ''}`}
            onClick={() => setCategoria(c)}
          >
            {c}
          </button>
        ))}
      </div>

      {estado === 'cargando' && (
        <ul className="grilla" aria-busy="true">
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
          <button className="boton boton-primario" onClick={reintentar}>
            <RefreshCw size={16} /> Reintentar
          </button>
        </div>
      )}

      {estado === 'listo' && visibles.length === 0 && (
        <div className="estado-vacio">
          <PackageSearch size={40} />
          <h3>No encontramos productos</h3>
          <p>Prueba con otra búsqueda o categoría.</p>
          <button className="boton boton-secundario" onClick={limpiarFiltros}>
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
              categoria={categoriaDe(producto)}
              enCarrito={carrito.find((item) => item.id === producto.id)?.cantidad ?? 0}
              agregarAlCarrito={agregarAlCarrito}
              disminuirDelCarrito={disminuirDelCarrito}
            />
          ))}
        </ul>
      )}
    </section>
  )
}

export default Catalogo
