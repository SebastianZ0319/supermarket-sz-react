import '../styles/checkout.css'
import { Link, useLocation } from 'react-router'
import { CheckCircle2, MapPin, Phone, Wallet } from 'lucide-react'
import { precioCop } from '../utils/formato'
import { METODOS_PAGO } from '../utils/tienda'

function Confirmacion() {
  const { state } = useLocation()
  const pedido = state?.pedido

  // Si se recarga la página ya no hay datos del pedido en memoria
  if (!pedido) {
    return (
      <div className="confirmacion contenedor">
        <div className="tarjeta confirmacion-tarjeta">
          <CheckCircle2 size={56} className="confirmacion-icono" />
          <h1>¡Gracias por tu compra!</h1>
          <p className="texto-suave">Tu pedido fue registrado. Te contactaremos para coordinar la entrega.</p>
          <Link to="/" className="boton boton-primario boton-grande">
            Volver a la tienda
          </Link>
        </div>
      </div>
    )
  }

  const metodo = METODOS_PAGO.find((m) => m.valor === pedido.metodoPago)

  return (
    <div className="confirmacion contenedor">
      <div className="tarjeta confirmacion-tarjeta">
        <CheckCircle2 size={56} className="confirmacion-icono" />
        <h1>¡Pedido confirmado!</h1>
        <p className="texto-suave">
          Gracias, {pedido.nombre.split(' ')[0]}. Tu pedido <strong>#{pedido.id}</strong> ya está en preparación.
        </p>

        <ul className="confirmacion-datos">
          <li>
            <MapPin size={18} /> {pedido.direccion}
          </li>
          <li>
            <Phone size={18} /> {pedido.telefono}
          </li>
          <li>
            <Wallet size={18} /> {metodo?.titulo} — {metodo?.detalle.toLowerCase()}
          </li>
        </ul>

        <table className="confirmacion-tabla">
          <tbody>
            {pedido.items.map((item) => (
              <tr key={item.id ?? item.nombre}>
                <td>
                  {item.cantidad} × {item.nombre}
                </td>
                <td>{precioCop.format(item.precio * item.cantidad)}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td>Envío</td>
              <td>{pedido.envio === 0 ? 'Gratis' : precioCop.format(pedido.envio)}</td>
            </tr>
            <tr className="resumen-total">
              <td>Total</td>
              <td>{precioCop.format(pedido.total)}</td>
            </tr>
          </tfoot>
        </table>

        <Link to="/" className="boton boton-primario boton-grande">
          Seguir comprando
        </Link>
      </div>
    </div>
  )
}

export default Confirmacion
