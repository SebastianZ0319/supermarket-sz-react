// Lógica pura del carrito (reducer). El stock real solo se descuenta en el backend al pagar,
// aquí únicamente se evita pedir más unidades de las disponibles.

export function carritoReducer(carrito, accion) {
  switch (accion.tipo) {
    case 'agregar': {
      const { producto } = accion
      const actual = carrito.find((i) => i.id === producto.id)
      const cantidad = (actual?.cantidad ?? 0) + 1
      if (cantidad > producto.stock) return carrito

      if (actual) return carrito.map((i) => (i.id === producto.id ? { ...i, cantidad } : i))
      const { id, nombre, precio, imagen } = producto
      return [...carrito, { id, nombre, precio, imagen, cantidad: 1 }]
    }

    case 'restar':
      return carrito
        .map((i) => (i.id === accion.id ? { ...i, cantidad: i.cantidad - 1 } : i))
        .filter((i) => i.cantidad > 0)

    case 'quitar':
      return carrito.filter((i) => i.id !== accion.id)

    case 'vaciar':
      return []

    // Ajusta el carrito a los productos del servidor: precios nuevos, productos borrados
    // y cantidades que ya no hay en stock
    case 'sincronizar': {
      const porId = new Map(accion.productos.map((p) => [p.id, p]))
      return carrito
        .filter((i) => porId.has(i.id))
        .map((i) => {
          const p = porId.get(i.id)
          return { ...i, nombre: p.nombre, precio: p.precio, imagen: p.imagen, cantidad: Math.min(i.cantidad, p.stock) }
        })
        .filter((i) => i.cantidad > 0)
    }

    default:
      return carrito
  }
}

export function resumenCarrito(carrito) {
  return {
    cantidad: carrito.reduce((acc, i) => acc + i.cantidad, 0),
    subtotal: carrito.reduce((acc, i) => acc + i.precio * i.cantidad, 0),
  }
}

export function leerCarritoGuardado() {
  try {
    const guardado = JSON.parse(localStorage.getItem('carrito'))
    return Array.isArray(guardado) ? guardado : []
  } catch {
    return []
  }
}
