import { useEffect, useRef } from 'react'
import { X } from 'lucide-react'

// Ventana modal accesible: Escape cierra, bloquea el scroll y devuelve el foco al salir
function Modal({ abierto, cerrar, titulo, children, ancho = 560, className = '' }) {
  const ref = useRef(null)

  useEffect(() => {
    if (!abierto) return
    const anterior = document.activeElement
    const alPresionar = (e) => e.key === 'Escape' && cerrar()

    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', alPresionar)
    ref.current?.focus()

    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', alPresionar)
      anterior?.focus?.()
    }
  }, [abierto, cerrar])

  if (!abierto) return null

  return (
    <div className="modal-fondo" onMouseDown={(e) => e.target === e.currentTarget && cerrar()}>
      <div
        ref={ref}
        className={`modal ${className}`}
        style={{ maxWidth: ancho }}
        role="dialog"
        aria-modal="true"
        aria-label={titulo}
        tabIndex={-1}
      >
        <button className="boton-icono modal-cerrar" onClick={cerrar} aria-label="Cerrar">
          <X size={20} />
        </button>
        {children}
      </div>
    </div>
  )
}

export default Modal
