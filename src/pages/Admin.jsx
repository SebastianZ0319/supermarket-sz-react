import '../styles/admin.css'
import { useCallback, useState } from 'react'
import { Link } from 'react-router'
import { Toaster, toast } from 'sonner'
import { ClipboardList, KeyRound, Loader2, LogOut, Package, Store } from 'lucide-react'
import { api, MODO_DEMO } from '../api/cliente'
import { useTema } from '../context/TemaContext'
import { useTienda } from '../context/TiendaContext'
import AvisoDemo from '../components/AvisoDemo'
import BotonTema from '../components/BotonTema'
import Marca from '../components/Marca'
import ProductosAdmin from '../components/admin/ProductosAdmin'
import PedidosAdmin from '../components/admin/PedidosAdmin'

const CLAVE_SESION = 'claveAdmin'

function leerClave() {
  try {
    return sessionStorage.getItem(CLAVE_SESION) ?? ''
  } catch {
    return ''
  }
}

function Ingreso({ entrar }) {
  const [clave, setClave] = useState('')
  const [error, setError] = useState('')
  const [cargando, setCargando] = useState(false)

  async function enviar(e) {
    e.preventDefault()
    setCargando(true)
    setError('')
    try {
      await api.admin.verificar(clave)
      entrar(clave)
    } catch (err) {
      setError(err.estado === 401 ? 'Clave incorrecta' : err.message)
    } finally {
      setCargando(false)
    }
  }

  return (
    <div className="ingreso">
      <form className="tarjeta ingreso-tarjeta" onSubmit={enviar}>
        <Marca sufijo="Admin" />
        <div className="ingreso-icono">
          <KeyRound size={26} />
        </div>
        <h1>Panel de administración</h1>
        <p className="texto-suave">
          {MODO_DEMO ? (
            <>
              Estás en la demo: la clave es <strong>demo</strong>.
            </>
          ) : (
            'Ingresa la clave ADMIN_KEY configurada en el .env del backend.'
          )}
        </p>
        <div className={`campo ${error ? 'con-error' : ''}`}>
          <label htmlFor="clave">Clave</label>
          <input
            id="clave"
            type="password"
            value={clave}
            onChange={(e) => setClave(e.target.value)}
            autoFocus
            autoComplete="current-password"
            aria-invalid={Boolean(error)}
          />
          {error && <span className="campo-error">{error}</span>}
        </div>
        <button className="boton boton-primario boton-grande boton-bloque" disabled={!clave || cargando}>
          {cargando ? <Loader2 size={18} className="girando" /> : 'Entrar'}
        </button>
        <Link to="/" className="volver">
          Volver a la tienda
        </Link>
      </form>
    </div>
  )
}

function Admin() {
  const { tema } = useTema()
  const { productos } = useTienda()
  const [clave, setClave] = useState(leerClave)
  const [pestana, setPestana] = useState('productos')

  function entrar(nueva) {
    try {
      sessionStorage.setItem(CLAVE_SESION, nueva)
    } catch {
      // la sesión dura solo mientras la pestaña esté abierta
    }
    setClave(nueva)
  }

  const salir = useCallback(() => {
    try {
      sessionStorage.removeItem(CLAVE_SESION)
    } catch {
      // nada que limpiar
    }
    setClave('')
  }, [])

  // Si el servidor rechaza la clave en cualquier momento se cierra la sesión
  const manejarError = useCallback(
    (error) => {
      if (error.estado === 401) {
        toast.error('La sesión expiró, vuelve a ingresar')
        salir()
      } else {
        toast.error(error.message)
      }
    },
    [salir]
  )

  return (
    <>
      <Toaster position="top-center" richColors closeButton theme={tema === 'oscuro' ? 'dark' : 'light'} />
      <AvisoDemo />

      {!clave ? (
        <Ingreso entrar={entrar} />
      ) : (
        <div className="admin">
          <header className="admin-header">
            <div className="contenedor admin-header-contenido">
              <Marca sufijo="Admin" />
              <div className="admin-header-acciones">
                <Link to="/" className="boton boton-secundario">
                  <Store size={16} /> <span className="ocultar-movil">Ver tienda</span>
                </Link>
                <BotonTema />
                <button className="boton-icono" onClick={salir} aria-label="Cerrar sesión" title="Cerrar sesión">
                  <LogOut size={20} />
                </button>
              </div>
            </div>
          </header>

          <main className="contenedor admin-contenido">
            <div className="pestanas" role="tablist">
              <button
                role="tab"
                aria-selected={pestana === 'productos'}
                className={pestana === 'productos' ? 'activa' : ''}
                onClick={() => setPestana('productos')}
              >
                <Package size={18} /> Productos <span className="pestana-numero">{productos.length}</span>
              </button>
              <button
                role="tab"
                aria-selected={pestana === 'pedidos'}
                className={pestana === 'pedidos' ? 'activa' : ''}
                onClick={() => setPestana('pedidos')}
              >
                <ClipboardList size={18} /> Pedidos
              </button>
            </div>

            {pestana === 'productos' ? (
              <ProductosAdmin clave={clave} manejarError={manejarError} />
            ) : (
              <PedidosAdmin clave={clave} manejarError={manejarError} />
            )}
          </main>
        </div>
      )}
    </>
  )
}

export default Admin
