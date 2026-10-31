import { RotateCcw } from 'lucide-react'
import { MODO_DEMO } from '../api/cliente'
import { reiniciarDemo } from '../api/demo'

// Franja que solo aparece en la demo publicada en el portafolio
function AvisoDemo() {
  if (!MODO_DEMO) return null

  function reiniciar() {
    reiniciarDemo()
    location.reload()
  }

  return (
    <div className="aviso-demo" role="note">
      <span>
        <strong>Demo</strong> · Sin backend: los pedidos y cambios se guardan solo en tu navegador. Admin: clave{' '}
        <code>demo</code>
      </span>
      <button type="button" onClick={reiniciar}>
        <RotateCcw size={14} /> Reiniciar
      </button>
    </div>
  )
}

export default AvisoDemo
