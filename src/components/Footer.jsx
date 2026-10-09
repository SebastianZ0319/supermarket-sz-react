import { Link } from 'react-router'
import Marca from './Marca'

function Footer() {
  return (
    <footer className="footer">
      <div className="contenedor footer-contenido">
        <Marca />
        <p className="texto-suave">© {new Date().getFullYear()} Supermarket SZ. Todos los derechos reservados.</p>
        <Link to="/admin" className="footer-enlace">
          Administración
        </Link>
      </div>
    </footer>
  )
}

export default Footer
