import { ArrowRight, Leaf, ShieldCheck, Zap } from 'lucide-react'

const beneficios = [
  { icono: Zap, texto: 'Entrega el mismo día' },
  { icono: Leaf, texto: 'Productos frescos' },
  { icono: ShieldCheck, texto: 'Pago seguro' },
]

function Hero() {
  return (
    <section className="contenedor">
      <div className="hero">
        <div className="hero-texto">
          <span className="hero-etiqueta">Ofertas de la semana</span>
          <h1>
            Tu mercado del día, <span>a un clic</span>
          </h1>
          <p>Todo lo que necesitas para tu hogar al mejor precio, directo a tu puerta.</p>

          <a href="#catalogo" className="boton boton-primario boton-grande">
            Ver productos <ArrowRight size={18} />
          </a>

          <ul className="hero-beneficios">
            {beneficios.map(({ icono: Icono, texto }) => (
              <li key={texto}>
                <Icono size={16} aria-hidden="true" />
                {texto}
              </li>
            ))}
          </ul>
        </div>

        <div className="hero-visual" aria-hidden="true">
          <div className="hero-circulo" />
          <img src="Fotos/cafe.png" alt="" className="hero-producto p1" />
          <img src="Fotos/leche.png" alt="" className="hero-producto p2" />
          <img src="Fotos/doritos.png" alt="" className="hero-producto p3" />
          <img src="Fotos/arroz.png" alt="" className="hero-producto p4" />
          <div className="hero-sello">
            <strong>100%</strong>
            <span>frescos</span>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero
