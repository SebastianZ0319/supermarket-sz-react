import { Minus, Plus, Trash2 } from 'lucide-react'

// Control de cantidad: − cantidad +. En 1 el botón izquierdo pasa a ser "quitar"
function Stepper({ cantidad, puedeSumar, sumar, restar, nombre, compacto = false }) {
  return (
    <div className={`stepper ${compacto ? 'compacto' : ''}`}>
      <button onClick={restar} aria-label={cantidad === 1 ? `Quitar ${nombre}` : `Restar un ${nombre}`}>
        {cantidad === 1 ? <Trash2 size={16} /> : <Minus size={16} />}
      </button>
      <span aria-live="polite">{cantidad}</span>
      <button onClick={sumar} disabled={!puedeSumar} aria-label={`Sumar un ${nombre}`}>
        <Plus size={16} />
      </button>
    </div>
  )
}

export default Stepper
