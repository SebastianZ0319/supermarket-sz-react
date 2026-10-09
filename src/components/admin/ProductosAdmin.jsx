import { useState } from 'react'
import { Pencil, Plus, Search, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { api } from '../../api/cliente'
import { useTienda } from '../../context/TiendaContext'
import { urlImagen } from '../../utils/formato'
import { STOCK_BAJO, categoriaDe, normalizar } from '../../utils/tienda'
import Precio from '../Precio'
import Confirmar from './Confirmar'
import FormularioProducto from './FormularioProducto'

// Campo de stock editable en la tabla: guarda al presionar Enter o salir del campo
function StockEditable({ producto, guardar }) {
  const [valor, setValor] = useState(String(producto.stock))
  const [anterior, setAnterior] = useState(producto.stock)

  // Si el stock cambia desde fuera (ej. una venta), se refleja en el campo
  if (producto.stock !== anterior) {
    setAnterior(producto.stock)
    setValor(String(producto.stock))
  }

  function confirmar() {
    if (!/^\d+$/.test(valor)) return setValor(String(producto.stock))
    if (Number(valor) !== producto.stock) guardar(producto, { stock: Number(valor) })
  }

  const clase = producto.stock === 0 ? 'stock-cero' : producto.stock <= STOCK_BAJO ? 'stock-bajo' : ''

  return (
    <input
      className={`stock-input ${clase}`}
      value={valor}
      inputMode="numeric"
      aria-label={`Stock de ${producto.nombre}`}
      onChange={(e) => setValor(e.target.value)}
      onBlur={confirmar}
      onKeyDown={(e) => e.key === 'Enter' && e.currentTarget.blur()}
    />
  )
}

function ProductosAdmin({ clave, manejarError }) {
  const { productos, recargarProductos } = useTienda()
  const [busqueda, setBusqueda] = useState('')
  const [editando, setEditando] = useState(null) // null | {} (nuevo) | producto
  const [eliminando, setEliminando] = useState(null)

  const visibles = productos.filter((p) => normalizar(p.nombre).includes(normalizar(busqueda)))

  async function guardarFormulario(datos) {
    try {
      if (editando.id) await api.admin.editarProducto(clave, editando.id, datos)
      else await api.admin.crearProducto(clave, datos)
      toast.success(editando.id ? 'Producto actualizado' : 'Producto creado')
      setEditando(null)
      recargarProductos()
    } catch (error) {
      if (error.estado === 400) return error.datos?.errores ?? {}
      manejarError(error)
    }
  }

  async function guardarRapido(producto, cambios) {
    try {
      await api.admin.editarProducto(clave, producto.id, cambios)
      toast.success(`Stock de ${producto.nombre} actualizado`)
      recargarProductos()
    } catch (error) {
      manejarError(error)
    }
  }

  async function eliminar() {
    try {
      await api.admin.eliminarProducto(clave, eliminando.id)
      toast.success(`${eliminando.nombre} eliminado`)
      recargarProductos()
    } catch (error) {
      manejarError(error)
    } finally {
      setEliminando(null)
    }
  }

  return (
    <section>
      <div className="admin-barra">
        <label className="buscador buscador-admin">
          <Search size={18} className="buscador-icono" aria-hidden="true" />
          <input type="search" placeholder="Buscar producto…" value={busqueda} onChange={(e) => setBusqueda(e.target.value)} />
        </label>
        <button className="boton boton-primario" onClick={() => setEditando({})}>
          <Plus size={18} /> Nuevo producto
        </button>
      </div>

      <div className="tabla-contenedor tarjeta">
        <table className="tabla">
          <thead>
            <tr>
              <th>Producto</th>
              <th>Categoría</th>
              <th>Precio</th>
              <th>Stock</th>
              <th>
                <span className="sr-only">Acciones</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {visibles.map((p) => (
              <tr key={p.id}>
                <td data-titulo="Producto">
                  <span className="tabla-producto">
                    <img src={urlImagen(p.imagen)} alt="" />
                    <span>
                      <strong>{p.nombre}</strong>
                      <small className="texto-suave">#{p.id}</small>
                    </span>
                  </span>
                </td>
                <td data-titulo="Categoría">
                  <span className="pildora">{categoriaDe(p)}</span>
                </td>
                <td data-titulo="Precio">
                  <Precio producto={p} />
                </td>
                <td data-titulo="Stock">
                  <StockEditable producto={p} guardar={guardarRapido} />
                </td>
                <td className="tabla-acciones">
                  <button className="boton-icono" onClick={() => setEditando(p)} aria-label={`Editar ${p.nombre}`}>
                    <Pencil size={18} />
                  </button>
                  <button className="boton-icono peligro" onClick={() => setEliminando(p)} aria-label={`Eliminar ${p.nombre}`}>
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {visibles.length === 0 && <p className="estado-vacio">No hay productos que coincidan.</p>}
      </div>

      {editando && (
        <FormularioProducto
          key={editando.id ?? 'nuevo'}
          producto={editando}
          guardar={guardarFormulario}
          cerrar={() => setEditando(null)}
        />
      )}

      <Confirmar
        abierto={Boolean(eliminando)}
        peligro
        titulo="¿Eliminar producto?"
        mensaje={`"${eliminando?.nombre}" dejará de aparecer en la tienda. Los pedidos anteriores conservan su información.`}
        textoConfirmar="Eliminar"
        confirmar={eliminar}
        cancelar={() => setEliminando(null)}
      />
    </section>
  )
}

export default ProductosAdmin
