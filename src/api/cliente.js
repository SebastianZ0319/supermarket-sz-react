export const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:3000').replace(/\/$/, '')

export class ErrorApi extends Error {
  constructor(mensaje, estado, datos) {
    super(mensaje)
    this.estado = estado
    this.datos = datos
  }
}

async function pedir(ruta, { metodo = 'GET', cuerpo, claveAdmin } = {}) {
  const headers = {}
  if (cuerpo !== undefined) headers['Content-Type'] = 'application/json'
  if (claveAdmin) headers['x-admin-key'] = claveAdmin

  let respuesta
  try {
    respuesta = await fetch(`${API_URL}${ruta}`, {
      method: metodo,
      headers,
      body: cuerpo !== undefined ? JSON.stringify(cuerpo) : undefined,
    })
  } catch {
    throw new ErrorApi('No se pudo conectar con el servidor', 0)
  }

  if (respuesta.status === 204) return null
  const datos = await respuesta.json().catch(() => null)
  if (!respuesta.ok) throw new ErrorApi(datos?.error ?? 'Error inesperado', respuesta.status, datos)
  return datos
}

export const api = {
  productos: () => pedir('/productos'),
  crearPedido: (pedido) => pedir('/pedidos', { metodo: 'POST', cuerpo: pedido }),

  admin: {
    verificar: (clave) => pedir('/admin/verificar', { claveAdmin: clave }),
    crearProducto: (clave, datos) => pedir('/productos', { metodo: 'POST', cuerpo: datos, claveAdmin: clave }),
    editarProducto: (clave, id, datos) => pedir(`/productos/${id}`, { metodo: 'PUT', cuerpo: datos, claveAdmin: clave }),
    eliminarProducto: (clave, id) => pedir(`/productos/${id}`, { metodo: 'DELETE', claveAdmin: clave }),
    pedidos: (clave) => pedir('/pedidos', { claveAdmin: clave }),
    cambiarEstado: (clave, id, estado) => pedir(`/pedidos/${id}`, { metodo: 'PATCH', cuerpo: { estado }, claveAdmin: clave }),
  },
}
