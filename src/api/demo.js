// API simulada para la demo publicada en el portafolio: misma interfaz que cliente.js,
// pero los datos viven en el navegador (localStorage) en lugar de Express + MySQL.
// Copia las reglas de rutas/ y validaciones.js del backend para que la tienda se comporte igual.
import { COSTO_ENVIO, ENVIO_GRATIS_DESDE } from '../utils/tienda'
import { ErrorApi } from './errores'
import PRODUCTOS_INICIALES from './productos-demo.json'

export const CLAVE_DEMO = 'demo'

const METODOS_PAGO = ['efectivo', 'datafono', 'transferencia']
const ESTADOS_PEDIDO = ['pendiente', 'enviado', 'entregado', 'cancelado']
const LLAVE_PRODUCTOS = 'demo-productos'
const LLAVE_PEDIDOS = 'demo-pedidos'

function leer(llave, inicial) {
  try {
    const guardado = JSON.parse(localStorage.getItem(llave))
    if (Array.isArray(guardado)) return guardado
  } catch {
    // dato corrupto: se vuelve al inicial
  }
  return structuredClone(inicial)
}

function guardar(llave, valor) {
  try {
    localStorage.setItem(llave, JSON.stringify(valor))
  } catch {
    // sin almacenamiento los cambios duran hasta recargar
  }
}

// Pequeña espera para que se vean los estados de carga como con el servidor real
const responder = (datos) => new Promise((resolver) => setTimeout(() => resolver(structuredClone(datos)), 250))
const fallar = (mensaje, estado, datos) =>
  new Promise((_, rechazar) => setTimeout(() => rechazar(new ErrorApi(mensaje, estado, datos)), 250))

function siguienteId(lista) {
  return lista.reduce((max, x) => Math.max(max, x.id), 0) + 1
}

const textoLimpio = (valor) => (typeof valor === 'string' ? valor.trim() : '')

function validarProducto(body, { parcial = false } = {}) {
  const datos = {}
  const errores = {}
  const presente = (campo) => body[campo] !== undefined

  if (!parcial || presente('nombre')) {
    const nombre = textoLimpio(body.nombre)
    if (!nombre) errores.nombre = 'El nombre es obligatorio'
    else if (nombre.length > 100) errores.nombre = 'Máximo 100 caracteres'
    else datos.nombre = nombre
  }
  if (!parcial || presente('precio')) {
    if (!Number.isInteger(body.precio) || body.precio <= 0) errores.precio = 'El precio debe ser un entero mayor a 0'
    else datos.precio = body.precio
  }
  if (!parcial || presente('stock')) {
    if (!Number.isInteger(body.stock) || body.stock < 0) errores.stock = 'El stock debe ser un entero mayor o igual a 0'
    else datos.stock = body.stock
  }
  for (const [campo, maximo] of [['imagen', 255], ['categoria', 50], ['descripcion', 1000]]) {
    if (!presente(campo)) continue
    const valor = textoLimpio(body[campo])
    if (valor.length > maximo) errores[campo] = `Máximo ${maximo} caracteres`
    else datos[campo] = valor || null
  }
  if (presente('precioAnterior')) {
    if (body.precioAnterior === null || body.precioAnterior === '') datos.precioAnterior = null
    else if (!Number.isInteger(body.precioAnterior) || body.precioAnterior <= 0)
      errores.precioAnterior = 'Debe ser un entero mayor a 0 o vacío'
    else datos.precioAnterior = body.precioAnterior
  }

  // Un precio anterior solo tiene sentido si es mayor al precio actual
  const precio = datos.precio ?? body.precio
  if (datos.precioAnterior && Number.isInteger(precio) && datos.precioAnterior <= precio) {
    errores.precioAnterior = 'Debe ser mayor al precio actual'
  }

  return { datos, errores, valido: Object.keys(errores).length === 0 }
}

function validarPedido(body) {
  const errores = {}
  const cliente = body?.cliente ?? {}
  const nombre = textoLimpio(cliente.nombre)
  const telefono = textoLimpio(cliente.telefono).replace(/[\s-]/g, '')
  const direccion = textoLimpio(cliente.direccion)
  const notas = textoLimpio(cliente.notas)

  if (nombre.length < 3) errores.nombre = 'Escribe tu nombre completo'
  if (!/^\+?\d{7,13}$/.test(telefono)) errores.telefono = 'Escribe un teléfono válido'
  if (direccion.length < 5) errores.direccion = 'Escribe una dirección válida'
  if (notas.length > 300) errores.notas = 'Máximo 300 caracteres'
  if (!METODOS_PAGO.includes(body?.metodoPago)) errores.metodoPago = 'Elige un método de pago'

  const porId = new Map()
  if (!Array.isArray(body?.items) || body.items.length === 0) errores.items = 'El carrito está vacío'
  else
    for (const item of body.items) {
      if (!Number.isInteger(item?.id) || !Number.isInteger(item?.cantidad) || item.cantidad <= 0) {
        errores.items = 'Hay productos inválidos en el carrito'
        break
      }
      porId.set(item.id, (porId.get(item.id) ?? 0) + item.cantidad)
    }

  return {
    valido: Object.keys(errores).length === 0,
    errores,
    datos: {
      cliente: { nombre, telefono, direccion, notas: notas || null },
      metodoPago: body?.metodoPago,
      items: [...porId].map(([id, cantidad]) => ({ id, cantidad })),
    },
  }
}

function conClave(clave, accion) {
  return clave === CLAVE_DEMO ? accion() : fallar('Clave de administrador inválida', 401)
}

export const api = {
  productos: () => responder(leer(LLAVE_PRODUCTOS, PRODUCTOS_INICIALES)),

  crearPedido(body) {
    const { datos, errores, valido } = validarPedido(body)
    if (!valido) return fallar('Datos inválidos', 400, { error: 'Datos inválidos', errores })

    const productos = leer(LLAVE_PRODUCTOS, PRODUCTOS_INICIALES)
    const porId = new Map(productos.map((p) => [p.id, p]))
    const faltantes = datos.items
      .filter((item) => (porId.get(item.id)?.stock ?? 0) < item.cantidad)
      .map((item) => ({
        id: item.id,
        nombre: porId.get(item.id)?.nombre ?? 'Producto no disponible',
        disponible: porId.get(item.id)?.stock ?? 0,
        solicitado: item.cantidad,
      }))
    if (faltantes.length > 0) return fallar('No hay stock suficiente', 409, { error: 'No hay stock suficiente', faltantes })

    // Los precios salen del catálogo, nunca del carrito
    const items = datos.items.map((item) => {
      const p = porId.get(item.id)
      p.stock -= item.cantidad
      return { id: p.id, nombre: p.nombre, precio: p.precio, cantidad: item.cantidad }
    })
    const subtotal = items.reduce((acc, l) => acc + l.precio * l.cantidad, 0)
    const envio = subtotal >= ENVIO_GRATIS_DESDE ? 0 : COSTO_ENVIO

    const pedidos = leer(LLAVE_PEDIDOS, [])
    const pedido = {
      id: siguienteId(pedidos),
      ...datos.cliente,
      metodoPago: datos.metodoPago,
      subtotal,
      envio,
      total: subtotal + envio,
      estado: 'pendiente',
      creadoEn: new Date().toISOString(),
      items,
    }
    guardar(LLAVE_PRODUCTOS, productos)
    guardar(LLAVE_PEDIDOS, [pedido, ...pedidos])
    return responder(pedido)
  },

  admin: {
    verificar: (clave) => conClave(clave, () => responder({ ok: true })),

    crearProducto: (clave, body) =>
      conClave(clave, () => {
        const { datos, errores, valido } = validarProducto(body)
        if (!valido) return fallar('Datos inválidos', 400, { error: 'Datos inválidos', errores })
        const productos = leer(LLAVE_PRODUCTOS, PRODUCTOS_INICIALES)
        const producto = { imagen: null, categoria: null, descripcion: null, precioAnterior: null, ...datos, id: siguienteId(productos) }
        guardar(LLAVE_PRODUCTOS, [...productos, producto])
        return responder(producto)
      }),

    editarProducto: (clave, id, body) =>
      conClave(clave, () => {
        const { datos, errores, valido } = validarProducto(body, { parcial: true })
        if (!valido) return fallar('Datos inválidos', 400, { error: 'Datos inválidos', errores })
        const productos = leer(LLAVE_PRODUCTOS, PRODUCTOS_INICIALES)
        const producto = productos.find((p) => p.id === id)
        if (!producto) return fallar('Producto no encontrado', 404)
        Object.assign(producto, datos)
        guardar(LLAVE_PRODUCTOS, productos)
        return responder(producto)
      }),

    eliminarProducto: (clave, id) =>
      conClave(clave, () => {
        const productos = leer(LLAVE_PRODUCTOS, PRODUCTOS_INICIALES)
        if (!productos.some((p) => p.id === id)) return fallar('Producto no encontrado', 404)
        guardar(LLAVE_PRODUCTOS, productos.filter((p) => p.id !== id))
        return responder(null)
      }),

    pedidos: (clave) => conClave(clave, () => responder(leer(LLAVE_PEDIDOS, []))),

    cambiarEstado: (clave, id, estado) =>
      conClave(clave, () => {
        if (!ESTADOS_PEDIDO.includes(estado)) return fallar(`Estado inválido. Usa: ${ESTADOS_PEDIDO.join(', ')}`, 400)
        const pedidos = leer(LLAVE_PEDIDOS, [])
        const pedido = pedidos.find((p) => p.id === id)
        if (!pedido) return fallar('Pedido no encontrado', 404)
        if (pedido.estado === 'cancelado') return fallar('Un pedido cancelado no se puede modificar', 409)

        // Al cancelar se devuelve el stock
        if (estado === 'cancelado') {
          const productos = leer(LLAVE_PRODUCTOS, PRODUCTOS_INICIALES)
          for (const item of pedido.items) {
            const p = productos.find((x) => x.id === item.id)
            if (p) p.stock += item.cantidad
          }
          guardar(LLAVE_PRODUCTOS, productos)
        }
        pedido.estado = estado
        guardar(LLAVE_PEDIDOS, pedidos)
        return responder(pedido)
      }),
  },
}

// Vuelve la demo a su estado original
export function reiniciarDemo() {
  for (const llave of [LLAVE_PRODUCTOS, LLAVE_PEDIDOS, 'carrito']) localStorage.removeItem(llave)
}
