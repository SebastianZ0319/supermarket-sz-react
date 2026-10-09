export const API_PRODUCTOS = 'http://localhost:3000/productos'

// Compras desde este valor no pagan domicilio
export const ENVIO_GRATIS_DESDE = 50000
export const COSTO_ENVIO = 5000

// Umbral para mostrar la etiqueta "Últimas unidades"
export const STOCK_BAJO = 3

export const CATEGORIAS = ['Todos', 'Bebidas', 'Snacks', 'Despensa', 'Lácteos y carnes', 'Aseo']

const PALABRAS_CATEGORIA = {
  Bebidas: ['coca', 'cola', 'jugo', 'agua', 'gaseosa', 'cafe', 'café'],
  Snacks: ['dorito', 'gomita', 'papas', 'galleta', 'chocolate'],
  Despensa: ['arroz', 'pasta', 'atun', 'atún', 'aceite', 'azucar', 'azúcar', 'frijol'],
  'Lácteos y carnes': ['leche', 'queso', 'yogur', 'salchicha', 'pollo', 'carne', 'huevo'],
  Aseo: ['papel', 'jabon', 'jabón', 'crema dental', 'detergente', 'shampoo'],
}

// El backend aún no envía categoría: si llega se usa, si no se deduce por el nombre
export function categoriaDe(producto) {
  if (producto.categoria) return producto.categoria
  const nombre = producto.nombre.toLowerCase()
  for (const [categoria, palabras] of Object.entries(PALABRAS_CATEGORIA)) {
    if (palabras.some((p) => nombre.includes(p))) return categoria
  }
  return 'Otros'
}

export function normalizar(texto) {
  return texto.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
}
