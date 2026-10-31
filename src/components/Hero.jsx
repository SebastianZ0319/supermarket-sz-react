import { ArrowRight, Leaf, ShieldCheck, Zap } from 'lucide-react'

const beneficios = [
  { icono: Zap, texto: 'Entrega el mismo día' },
  { icono: Leaf, texto: 'Productos frescos' },
  { icono: ShieldCheck, texto: 'Pagas al recibir' },
]

function Hero() {
  return (
    <section className="contenedor">
      <div className="hero">
        <div className="hero-texto">
          <span className="hero-etiqueta">Tu supermercado en casa</span>
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
          <img src={`${import.meta.env.BASE_URL}Fotos/cafe.webp`} alt="" className="hero-producto p1" />
          <img src={`${import.meta.env.BASE_URL}Fotos/leche.webp`} alt="" className="hero-producto p2" />
          <img src={`${import.meta.env.BASE_URL}Fotos/doritos.webp`} alt="" className="hero-producto p3" />
          <img src={`${import.meta.env.BASE_URL}Fotos/arroz.webp`} alt="" className="hero-producto p4" />
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
