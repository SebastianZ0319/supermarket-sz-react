import { useState } from 'react'
import { Loader2 } from 'lucide-react'
import { urlImagen } from '../../utils/formato'
import { CATEGORIAS } from '../../utils/tienda'
import Modal from '../Modal'

const IMAGENES_DISPONIBLES = [
  'arroz', 'atun', 'cafe', 'coca-cola', 'crema_dental', 'doritos', 'gomitas',
  'jabon_loza', 'leche', 'papel', 'pasta', 'salchichas',
].map((n) => `Fotos/${n}.webp`)

function aFormulario(producto) {
  return {
    nombre: producto?.nombre ?? '',
    categoria: producto?.categoria ?? '',
    precio: producto?.precio?.toString() ?? '',
    precioAnterior: producto?.precioAnterior?.toString() ?? '',
    stock: producto?.stock?.toString() ?? '0',
    imagen: producto?.imagen ?? '',
    descripcion: producto?.descripcion ?? '',
  }
}

function validar(f) {
  const errores = {}
  const entero = (v) => /^\d+$/.test(v)
  if (!f.nombre.trim()) errores.nombre = 'Obligatorio'
  if (!entero(f.precio) || Number(f.precio) <= 0) errores.precio = 'Entero mayor a 0'
  if (!entero(f.stock)) errores.stock = 'Entero mayor o igual a 0'
  if (f.precioAnterior) {
    if (!entero(f.precioAnterior)) errores.precioAnterior = 'Entero o vacío'
    else if (Number(f.precioAnterior) <= Number(f.precio)) errores.precioAnterior = 'Debe ser mayor al precio'
  }
  return errores
}

// Se monta de nuevo cada vez que se abre (key en el padre), así el estado inicial siempre es el correcto
function FormularioProducto({ producto, guardar, cerrar }) {
  const [form, setForm] = useState(() => aFormulario(producto))
  const [errores, setErrores] = useState({})
  const [guardando, setGuardando] = useState(false)
  const editando = Boolean(producto?.id)

  const cambiar = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  async function enviar(e) {
    e.preventDefault()
    const encontrados = validar(form)
    setErrores(encontrados)
    if (Object.keys(encontrados).length > 0) return

    setGuardando(true)
    const errServidor = await guardar({
      nombre: form.nombre.trim(),
      categoria: form.categoria,
      precio: Number(form.precio),
      precioAnterior: form.precioAnterior ? Number(form.precioAnterior) : null,
      stock: Number(form.stock),
      imagen: form.imagen.trim(),
      descripcion: form.descripcion.trim(),
    })
    setGuardando(false)
    if (errServidor) setErrores(errServidor)
  }

  const campo = (name, etiqueta, input) => (
    <div className={`campo ${errores[name] ? 'con-error' : ''}`}>
      <label htmlFor={`p-${name}`}>{etiqueta}</label>
      {input}
      {errores[name] && <span className="campo-error">{errores[name]}</span>}
    </div>
  )

  return (
    <Modal abierto cerrar={cerrar} titulo={editando ? 'Editar producto' : 'Nuevo producto'} ancho={720}>
      <form className="form-producto" onSubmit={enviar} noValidate>
        <h2>{editando ? 'Editar producto' : 'Nuevo producto'}</h2>

        <div className="form-producto-grilla">
          <div className="form-producto-preview">
            <img src={urlImagen(form.imagen)} alt="" />
          </div>

          <div className="form-producto-campos">
            {campo('nombre', 'Nombre', <input id="p-nombre" name="nombre" value={form.nombre} onChange={cambiar} maxLength={100} />)}

            <div className="campos-dos">
              {campo(
                'categoria',
                'Categoría',
                <select id="p-categoria" name="categoria" value={form.categoria} onChange={cambiar}>
                  <option value="">Sin categoría</option>
                  {CATEGORIAS.map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              )}
              {campo('stock', 'Stock', <input id="p-stock" name="stock" inputMode="numeric" value={form.stock} onChange={cambiar} />)}
            </div>

            <div className="campos-dos">
              {campo('precio', 'Precio', <input id="p-precio" name="precio" inputMode="numeric" value={form.precio} onChange={cambiar} placeholder="5000" />)}
              {campo(
                'precioAnterior',
                'Precio antes (oferta)',
                <input id="p-precioAnterior" name="precioAnterior" inputMode="numeric" value={form.precioAnterior} onChange={cambiar} placeholder="Vacío = sin oferta" />
              )}
            </div>

            {campo(
              'imagen',
              'Imagen (ruta o URL)',
              <>
                <input id="p-imagen" name="imagen" value={form.imagen} onChange={cambiar} list="imagenes" placeholder="Fotos/leche.webp" />
                <datalist id="imagenes">
                  {IMAGENES_DISPONIBLES.map((i) => (
                    <option key={i} value={i} />
                  ))}
                </datalist>
              </>
            )}
          </div>
        </div>

        {campo(
          'descripcion',
          'Descripción (opcional)',
          <textarea id="p-descripcion" name="descripcion" rows={3} value={form.descripcion} onChange={cambiar} maxLength={1000} />
        )}

        <div className="confirmar-acciones">
          <button type="button" className="boton boton-secundario" onClick={cerrar}>
            Cancelar
          </button>
          <button className="boton boton-primario" disabled={guardando}>
            {guardando && <Loader2 size={16} className="girando" />}
            {editando ? 'Guardar cambios' : 'Crear producto'}
          </button>
        </div>
      </form>
    </Modal>
  )
}

export default FormularioProducto
