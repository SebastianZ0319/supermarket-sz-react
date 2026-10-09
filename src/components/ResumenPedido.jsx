import { precioCop } from '../utils/formato'
import { calcularTotales } from '../utils/tienda'

// Subtotal, envío y total; se usa en el carrito y en el checkout
function ResumenPedido({ subtotal }) {
  const { envio, total } = calcularTotales(subtotal)

  return (
    <dl className="resumen">
      <div>
        <dt>Subtotal</dt>
        <dd>{precioCop.format(subtotal)}</dd>
      </div>
      <div>
        <dt>Envío</dt>
        <dd className={envio === 0 ? 'texto-verde' : ''}>{envio === 0 ? 'Gratis' : precioCop.format(envio)}</dd>
      </div>
      <div className="resumen-total">
        <dt>Total</dt>
        <dd>{precioCop.format(total)}</dd>
      </div>
    </dl>
  )
}

export default ResumenPedido
