import '../styles/checkout.css'
import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router'
import { ArrowLeft, Banknote, CreditCard, Landmark, Loader2, Lock } from 'lucide-react'
import { toast } from 'sonner'
import { api } from '../api/cliente'
import { useTienda } from '../context/TiendaContext'
import { precioCop, urlImagen } from '../utils/formato'
import { METODOS_PAGO, calcularTotales, validarCheckout } from '../utils/tienda'
import BarraEnvio from '../components/BarraEnvio'
import ResumenPedido from '../components/ResumenPedido'

const ICONOS_PAGO = { efectivo: Banknote, datafono: CreditCard, transferencia: Landmark }

const FORMULARIO_VACIO = { nombre: '', telefono: '', direccion: '', notas: '', metodoPago: 'efectivo' }

function Campo({ id, etiqueta, error, children, ayuda }) {
  return (
    <div className={`campo ${error ? 'con-error' : ''}`}>
      <label htmlFor={id}>{etiqueta}</label>
      {children}
      {error ? (
        <span className="campo-error" id={`${id}-error`}>
          {error}
        </span>
      ) : (
        ayuda && <span className="campo-ayuda">{ayuda}</span>
      )}
    </div>
  )
}

function Checkout() {
  const { carrito, subtotal, cantidad, vaciar, recargarProductos } = useTienda()
  const navegar = useNavigate()
  const [form, setForm] = useState(FORMULARIO_VACIO)
  const [errores, setErrores] = useState({})
  const [tocados, setTocados] = useState({})
  const [enviando, setEnviando] = useState(false)
  const [faltantes, setFaltantes] = useState([])

  // Sin productos no hay nada que pagar (salvo que se esté mostrando el aviso de stock)
  if (carrito.length === 0 && !enviando && faltantes.length === 0) return <Navigate to="/" replace />

  const { total } = calcularTotales(subtotal)
  const erroresVisibles = Object.fromEntries(Object.entries(errores).filter(([campo]) => tocados[campo]))

  function cambiar(e) {
    const { name, value } = e.target
    const nuevo = { ...form, [name]: value }
    setForm(nuevo)
    setErrores(validarCheckout(nuevo))
  }

  function salir(e) {
    setTocados((t) => ({ ...t, [e.target.name]: true }))
    setErrores(validarCheckout(form))
  }

  async function enviar(e) {
    e.preventDefault()
    const encontrados = validarCheckout(form)
    setErrores(encontrados)
    setTocados({ nombre: true, telefono: true, direccion: true, notas: true, metodoPago: true })
    if (Object.keys(encontrados).length > 0) {
      document.querySelector(`[name="${Object.keys(encontrados)[0]}"]`)?.focus()
      return
    }

    setEnviando(true)
    setFaltantes([])
    try {
      const pedido = await api.crearPedido({
        cliente: { nombre: form.nombre, telefono: form.telefono, direccion: form.direccion, notas: form.notas },
        metodoPago: form.metodoPago,
        items: carrito.map(({ id, cantidad }) => ({ id, cantidad })),
      })
      vaciar()
      recargarProductos()
      navegar('/pedido-confirmado', { replace: true, state: { pedido } })
    } catch (error) {
      setEnviando(false)
      if (error.estado === 409) {
        // Alguien compró antes: se muestra qué falta y se ajusta el carrito al stock real
        setFaltantes(error.datos.faltantes)
        recargarProductos()
        toast.error('Algunos productos ya no tienen stock suficiente')
      } else if (error.estado === 400 && error.datos?.errores) {
        setErrores(error.datos.errores)
        toast.error('Revisa los datos del formulario')
      } else {
        toast.error(error.message)
      }
    }
  }

  const props = (name) => ({
    id: name,
    name,
    value: form[name],
    onChange: cambiar,
    onBlur: salir,
    'aria-invalid': Boolean(erroresVisibles[name]),
    'aria-describedby': erroresVisibles[name] ? `${name}-error` : undefined,
  })

  return (
    <div className="checkout contenedor">
      <Link to="/" className="volver">
        <ArrowLeft size={18} /> Seguir comprando
      </Link>
      <h1 className="checkout-titulo">Finalizar compra</h1>

      <form className="checkout-grilla" onSubmit={enviar} noValidate>
        <div className="checkout-formulario">
          {faltantes.length > 0 && (
            <div className="alerta alerta-error" role="alert">
              <strong>Ajustamos tu carrito porque cambió el stock:</strong>
              <ul>
                {faltantes.map((f) => (
                  <li key={f.id}>
                    {f.nombre}: pediste {f.solicitado}, {f.disponible === 0 ? 'ya no quedan' : `quedan ${f.disponible}`}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <fieldset className="tarjeta">
            <legend>
              <span className="paso">1</span> Datos de entrega
            </legend>
            <div className="campos-dos">
              <Campo id="nombre" etiqueta="Nombre completo" error={erroresVisibles.nombre}>
                <input {...props('nombre')} autoComplete="name" placeholder="Ana Pérez" />
              </Campo>
              <Campo id="telefono" etiqueta="Teléfono" error={erroresVisibles.telefono}>
                <input {...props('telefono')} type="tel" inputMode="tel" autoComplete="tel" placeholder="300 123 4567" />
              </Campo>
            </div>
            <Campo id="direccion" etiqueta="Dirección" error={erroresVisibles.direccion} ayuda="Incluye barrio, torre o apartamento">
              <input {...props('direccion')} autoComplete="street-address" placeholder="Calle 10 # 20-30, Barrio Centro" />
            </Campo>
            <Campo id="notas" etiqueta="Notas para el domiciliario (opcional)" error={erroresVisibles.notas}>
              <textarea {...props('notas')} rows={3} maxLength={300} placeholder="Ej: dejar en portería" />
            </Campo>
          </fieldset>

          <fieldset className="tarjeta">
            <legend>
              <span className="paso">2</span> Método de pago
            </legend>
            <div className="metodos" role="radiogroup">
              {METODOS_PAGO.map((m) => {
                const Icono = ICONOS_PAGO[m.valor]
                return (
                  <label key={m.valor} className={`metodo ${form.metodoPago === m.valor ? 'activo' : ''}`}>
                    <input type="radio" name="metodoPago" value={m.valor} checked={form.metodoPago === m.valor} onChange={cambiar} />
                    <Icono size={22} aria-hidden="true" />
                    <span>
                      <strong>{m.titulo}</strong>
                      <small>{m.detalle}</small>
                    </span>
                  </label>
                )
              })}
            </div>
            <p className="checkout-nota">
              <Lock size={14} aria-hidden="true" /> No pedimos datos de tarjeta en línea: pagas al recibir tu pedido.
            </p>
          </fieldset>
        </div>

        <aside className="checkout-resumen tarjeta">
          <h2>Tu pedido ({cantidad})</h2>
          <ul className="checkout-items">
            {carrito.map((item) => (
              <li key={item.id}>
                <span className="checkout-item-img">
                  <img src={urlImagen(item.imagen)} alt="" />
                  <span>{item.cantidad}</span>
                </span>
                <span className="checkout-item-nombre">{item.nombre}</span>
                <strong>{precioCop.format(item.precio * item.cantidad)}</strong>
              </li>
            ))}
          </ul>
          <BarraEnvio subtotal={subtotal} />
          <ResumenPedido subtotal={subtotal} />
          <button type="submit" className="boton boton-primario boton-grande boton-bloque" disabled={enviando || carrito.length === 0}>
            {enviando ? (
              <>
                <Loader2 size={18} className="girando" /> Procesando…
              </>
            ) : (
              <>Confirmar pedido · {precioCop.format(total)}</>
            )}
          </button>
        </aside>
      </form>
    </div>
  )
}

export default Checkout
