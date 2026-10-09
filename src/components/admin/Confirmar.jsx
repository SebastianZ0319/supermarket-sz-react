import { AlertTriangle } from 'lucide-react'
import Modal from '../Modal'

// Diálogo de confirmación para acciones que no se pueden deshacer
function Confirmar({ abierto, titulo, mensaje, textoConfirmar = 'Confirmar', peligro = false, confirmar, cancelar }) {
  return (
    <Modal abierto={abierto} cerrar={cancelar} titulo={titulo} ancho={420}>
      <div className="confirmar">
        <div className={`confirmar-icono ${peligro ? 'peligro' : ''}`}>
          <AlertTriangle size={24} />
        </div>
        <h2>{titulo}</h2>
        <p className="texto-suave">{mensaje}</p>
        <div className="confirmar-acciones">
          <button className="boton boton-secundario" onClick={cancelar}>
            Cancelar
          </button>
          <button className={`boton ${peligro ? 'boton-peligro' : 'boton-primario'}`} onClick={confirmar}>
            {textoConfirmar}
          </button>
        </div>
      </div>
    </Modal>
  )
}

export default Confirmar
