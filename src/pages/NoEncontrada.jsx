import { Link } from 'react-router'
import { SearchX } from 'lucide-react'

function NoEncontrada() {
  return (
    <div className="contenedor estado-vacio pagina-404">
      <SearchX size={48} />
      <h3>Esta página no existe</h3>
      <p>Puede que el enlace esté mal escrito o que la página se haya movido.</p>
      <Link to="/" className="boton boton-primario">
        Ir a la tienda
      </Link>
    </div>
  )
}

export default NoEncontrada
