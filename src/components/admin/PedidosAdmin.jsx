import { useCallback, useEffect, useState } from 'react'
import { ClipboardList, MapPin, Phone, RefreshCw, StickyNote } from 'lucide-react'
import { toast } from 'sonner'
import { api } from '../../api/cliente'
import { useTienda } from '../../context/TiendaContext'
import { fechaCorta, precioCop } from '../../utils/formato'
import { ESTADOS_PEDIDO, METODOS_PAGO } from '../../utils/tienda'
import Confirmar from './Confirmar'

function PedidosAdmin({ clave, manejarError }) {
  const { recargarProductos } = useTienda()
  const [pedidos, setPedidos] = useState(null)
  const [filtro, setFiltro] = useState('todos')
  const [cancelando, setCancelando] = useState(null)

  const cargar = useCallback(
    () =>
      api.admin.pedidos(clave).then(setPedidos, (error) => {
        manejarError(error)
        setPedidos([])
      }),
    [clave, manejarError]
  )

  useEffect(() => {
    cargar()
  }, [cargar])

  async function cambiarEstado(pedido, estado) {
    try {
      const actualizado = await api.admin.cambiarEstado(clave, pedido.id, estado)
      setPedidos((lista) => lista.map((p) => (p.id === pedido.id ? actualizado : p)))
      toast.success(`Pedido #${pedido.id}: ${ESTADOS_PEDIDO[estado].toLowerCase()}`)
      // Cancelar devuelve el stock
      if (estado === 'cancelado') recargarProductos()
    } catch (error) {
      manejarError(error)
    }
  }

  function alCambiar(pedido, estado) {
    if (estado === 'cancelado') setCancelando(pedido)
    else cambiarEstado(pedido, estado)
  }

  if (pedidos === null) {
    return (
      <div className="lista-pedidos">
        {[1, 2, 3].map((i) => (
          <div key={i} className="esqueleto esqueleto-pedido" />
        ))}
      </div>
    )
  }

  const visibles = filtro === 'todos' ? pedidos : pedidos.filter((p) => p.estado === filtro)
  const contar = (estado) => pedidos.filter((p) => p.estado === estado).length

  return (
    <section>
      <div className="admin-barra">
        <div className="chips">
          <button className={`chip ${filtro === 'todos' ? 'activo' : ''}`} onClick={() => setFiltro('todos')}>
            Todos ({pedidos.length})
          </button>
          {Object.entries(ESTADOS_PEDIDO).map(([valor, texto]) => (
            <button key={valor} className={`chip ${filtro === valor ? 'activo' : ''}`} onClick={() => setFiltro(valor)}>
              {texto} ({contar(valor)})
            </button>
          ))}
        </div>
        <button className="boton boton-secundario" onClick={cargar}>
          <RefreshCw size={16} /> Actualizar
        </button>
      </div>

      {visibles.length === 0 ? (
        <div className="estado-vacio tarjeta">
          <ClipboardList size={40} />
          <h3>No hay pedidos {filtro !== 'todos' && `en estado "${ESTADOS_PEDIDO[filtro].toLowerCase()}"`}</h3>
          <p>Los pedidos que hagan los clientes aparecerán aquí.</p>
        </div>
      ) : (
        <ul className="lista-pedidos">
          {visibles.map((pedido) => (
            <li key={pedido.id} className="tarjeta pedido">
              <div className="pedido-encabezado">
                <div>
                  <strong>Pedido #{pedido.id}</strong>
                  <span className="texto-suave">{fechaCorta.format(new Date(pedido.creadoEn))}</span>
                </div>
                <select
                  className={`estado estado-${pedido.estado}`}
                  value={pedido.estado}
                  disabled={pedido.estado === 'cancelado'}
                  onChange={(e) => alCambiar(pedido, e.target.value)}
                  aria-label={`Estado del pedido ${pedido.id}`}
                >
                  {Object.entries(ESTADOS_PEDIDO).map(([valor, texto]) => (
                    <option key={valor} value={valor}>
                      {texto}
                    </option>
                  ))}
                </select>
              </div>

              <div className="pedido-cuerpo">
                <div className="pedido-cliente">
                  <strong>{pedido.nombre}</strong>
                  <span>
                    <Phone size={14} /> {pedido.telefono}
                  </span>
                  <span>
                    <MapPin size={14} /> {pedido.direccion}
                  </span>
                  {pedido.notas && (
                    <span>
                      <StickyNote size={14} /> {pedido.notas}
                    </span>
                  )}
                </div>

                <ul className="pedido-items">
                  {pedido.items.map((item, i) => (
                    <li key={i}>
                      <span>
                        {item.cantidad} × {item.nombre}
                      </span>
                      <span>{precioCop.format(item.precio * item.cantidad)}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pedido-pie">
                <span className="pildora">{METODOS_PAGO.find((m) => m.valor === pedido.metodoPago)?.titulo}</span>
                <span>
                  Envío {pedido.envio === 0 ? 'gratis' : precioCop.format(pedido.envio)} · <strong>{precioCop.format(pedido.total)}</strong>
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}

      <Confirmar
        abierto={Boolean(cancelando)}
        peligro
        titulo={`¿Cancelar el pedido #${cancelando?.id}?`}
        mensaje="El stock de sus productos se devolverá al inventario. Un pedido cancelado ya no se puede modificar."
        textoConfirmar="Cancelar pedido"
        confirmar={() => {
          cambiarEstado(cancelando, 'cancelado')
          setCancelando(null)
        }}
        cancelar={() => setCancelando(null)}
      />
    </section>
  )
}

export default PedidosAdmin
