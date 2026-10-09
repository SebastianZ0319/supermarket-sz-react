export const precioCop = new Intl.NumberFormat('es-CO', {
  style: 'currency',
  currency: 'COP',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
})

export const fechaCorta = new Intl.DateTimeFormat('es-CO', {
  dateStyle: 'medium',
  timeStyle: 'short',
})

export function plural(cantidad, singular, pluralTexto = `${singular}s`) {
  return `${cantidad} ${cantidad === 1 ? singular : pluralTexto}`
}

// Las imágenes guardadas como "Fotos/x.webp" se sirven desde la raíz; las URL completas se dejan igual
export function urlImagen(imagen) {
  if (!imagen) return '/favicon.png'
  return /^(https?:)?\/\//.test(imagen) || imagen.startsWith('/') ? imagen : `/${imagen}`
}
