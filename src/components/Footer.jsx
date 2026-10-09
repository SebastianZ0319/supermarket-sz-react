function Footer() {
  return (
    <footer className="footer">
      <div className="contenedor footer-contenido">
        <div className="marca">
          <img src="Fotos/Logo.png" alt="" className="marca-logo" />
          <span className="marca-nombre">
            Supermarket <strong>SZ</strong>
          </span>
        </div>
        <p className="texto-suave">© {new Date().getFullYear()} Supermarket SZ. Todos los derechos reservados.</p>
      </div>
    </footer>
  )
}

export default Footer
