import { describe, expect, it } from 'vitest'
import { COSTO_ENVIO, calcularTotales, filtrarProductos, porcentajeDescuento, validarCheckout } from './tienda'
import { urlImagen } from './formato'
import { PRODUCTOS } from '../test/datos'

describe('filtrarProductos', () => {
  it('busca sin importar tildes ni mayúsculas', () => {
    expect(filtrarProductos(PRODUCTOS, { busqueda: 'CAFE' }).map((p) => p.id)).toEqual([3])
  })

  it('filtra por categoría y por ofertas', () => {
    expect(filtrarProductos(PRODUCTOS, { categoria: 'Snacks' }).map((p) => p.id)).toEqual([2])
    expect(filtrarProductos(PRODUCTOS, { categoria: 'Ofertas' }).map((p) => p.id)).toEqual([2])
  })

  it('ordena por precio', () => {
    expect(filtrarProductos(PRODUCTOS, { orden: 'precio-desc' }).map((p) => p.id)).toEqual([3, 2, 1])
  })
})

describe('calcularTotales', () => {
  it('cobra envío por debajo del umbral y no con el carrito vacío', () => {
    expect(calcularTotales(10000)).toEqual({ subtotal: 10000, envio: COSTO_ENVIO, total: 10000 + COSTO_ENVIO })
    expect(calcularTotales(0).envio).toBe(0)
    expect(calcularTotales(60000).envio).toBe(0)
  })
})

describe('porcentajeDescuento', () => {
  it('calcula el descuento redondeado', () => {
    expect(porcentajeDescuento(PRODUCTOS[1])).toBe(20)
    expect(porcentajeDescuento(PRODUCTOS[0])).toBe(0)
  })
})

describe('validarCheckout', () => {
  const valido = { nombre: 'Ana Pérez', telefono: '300 123 4567', direccion: 'Calle 10 # 20-30', metodoPago: 'efectivo' }

  it('acepta datos correctos', () => {
    expect(validarCheckout(valido)).toEqual({})
  })

  it('marca cada campo inválido', () => {
    const errores = validarCheckout({ nombre: 'A', telefono: '12', direccion: '', metodoPago: '' })
    expect(Object.keys(errores).sort()).toEqual(['direccion', 'metodoPago', 'nombre', 'telefono'])
  })
})

describe('urlImagen', () => {
  it('agrega la barra inicial solo a rutas relativas', () => {
    expect(urlImagen('Fotos/leche.webp')).toBe('/Fotos/leche.webp')
    expect(urlImagen('https://cdn.com/a.png')).toBe('https://cdn.com/a.png')
  })
})
