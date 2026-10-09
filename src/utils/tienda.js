// Deben coincidir con validaciones.js del backend, que es quien cobra de verdad
export const ENVIO_GRATIS_DESDE = 50000
export const COSTO_ENVIO = 5000

// Umbral para mostrar la etiqueta "Últimas unidades"
export const STOCK_BAJO = 3

export const CATEGORIAS = ['Bebidas', 'Snacks', 'Despensa', 'Lácteos y carnes', 'Aseo']

export const METODOS_PAGO = [
  { valor: 'efectivo', titulo: 'Efectivo', detalle: 'Pagas al recibir tu pedido' },
  { valor: 'datafono', titulo: 'Tarjeta (datáfono)', detalle: 'El domiciliario lleva datáfono' },
  { valor: 'transferencia', titulo: 'Transferencia', detalle: 'Nequi o Bancolombia al confirmar' },
]

export const ESTADOS_PEDIDO = {
  pendiente: 'Pendiente',
  enviado: 'Enviado',
  entregado: 'Entregado',
  cancelado: 'Cancelado',
}

export function categoriaDe(producto) {
  return producto.categoria || 'Otros'
}

export function enOferta(producto) {
  return Boolean(producto.precioAnterior) && producto.precioAnterior > producto.precio
}

export function porcentajeDescuento(producto) {
  if (!enOferta(producto)) return 0
  return Math.round((1 - producto.precio / producto.precioAnterior) * 100)
}

export function calcularTotales(subtotal) {
  const envio = subtotal === 0 || subtotal >= ENVIO_GRATIS_DESDE ? 0 : COSTO_ENVIO
  return { subtotal, envio, total: subtotal + envio }
}

export function normalizar(texto) {
  return texto.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
}

export function filtrarProductos(productos, { busqueda = '', categoria = 'Todos', orden = 'relevancia' }) {
  const texto = normalizar(busqueda.trim())
  const filtrados = productos.filter((p) => {
    const coincideCategoria =
      categoria === 'Todos' || (categoria === 'Ofertas' ? enOferta(p) : categoriaDe(p) === categoria)
    return coincideCategoria && normalizar(p.nombre).includes(texto)
  })

  const ordenados = [...filtrados]
  if (orden === 'precio-asc') ordenados.sort((a, b) => a.precio - b.precio)
  if (orden === 'precio-desc') ordenados.sort((a, b) => b.precio - a.precio)
  if (orden === 'nombre') ordenados.sort((a, b) => a.nombre.localeCompare(b.nombre, 'es'))
  return ordenados
}

// Misma regla que el backend, para avisar antes de enviar el formulario
export function validarCheckout({ nombre, telefono, direccion, notas = '', metodoPago }) {
  const errores = {}
  if (nombre.trim().length < 3) errores.nombre = 'Escribe tu nombre completo'
  if (!/^\+?\d{7,13}$/.test(telefono.replace(/[\s-]/g, ''))) errores.telefono = 'Escribe un teléfono válido'
  if (direccion.trim().length < 5) errores.direccion = 'Escribe una dirección válida'
  if (notas.length > 300) errores.notas = 'Máximo 300 caracteres'
  if (!METODOS_PAGO.some((m) => m.valor === metodoPago)) errores.metodoPago = 'Elige un método de pago'
  return errores
}
