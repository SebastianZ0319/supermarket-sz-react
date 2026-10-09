import { Truck } from 'lucide-react'
import { precioCop } from '../utils/formato'
import { ENVIO_GRATIS_DESDE } from '../utils/tienda'

function BarraEnvio({ subtotal }) {
  const gratis = subtotal >= ENVIO_GRATIS_DESDE
  const progreso = Math.min(100, (subtotal / ENVIO_GRATIS_DESDE) * 100)

  return (
    <div className="envio">
      <p>
        <Truck size={16} aria-hidden="true" />
        {gratis ? (
          <span>
            ¡Tienes <strong>envío gratis</strong>!
          </span>
        ) : (
          <span>
            Te faltan <strong>{precioCop.format(ENVIO_GRATIS_DESDE - subtotal)}</strong> para envío gratis
          </span>
        )}
      </p>
      <div
        className="envio-barra"
        role="progressbar"
        aria-valuenow={Math.round(progreso)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Progreso hacia el envío gratis"
      >
        <div style={{ width: `${progreso}%` }} />
      </div>
    </div>
  )
}

export default BarraEnvio
