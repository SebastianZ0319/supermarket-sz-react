import { Moon, Sun } from 'lucide-react'
import { useTema } from '../context/TemaContext'

function BotonTema() {
  const { tema, alternarTema } = useTema()
  const oscuro = tema === 'oscuro'

  return (
    <button
      className="boton-icono"
      onClick={alternarTema}
      aria-label={oscuro ? 'Activar modo claro' : 'Activar modo oscuro'}
      title={oscuro ? 'Modo claro' : 'Modo oscuro'}
    >
      {oscuro ? <Sun size={20} /> : <Moon size={20} />}
    </button>
  )
}

export default BotonTema
