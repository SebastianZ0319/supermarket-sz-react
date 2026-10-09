import { describe, expect, it } from 'vitest'
import { carritoReducer, leerCarritoGuardado, resumenCarrito } from './carrito'
import { PRODUCTOS } from '../test/datos'

const [leche, doritos] = PRODUCTOS

describe('carritoReducer', () => {
  it('agrega un producto nuevo con cantidad 1', () => {
    const carrito = carritoReducer([], { tipo: 'agregar', producto: leche })
    expect(carrito).toEqual([{ id: 1, nombre: 'Leche', precio: 5000, imagen: 'Fotos/leche.webp', cantidad: 1 }])
  })

  it('suma cantidad si el producto ya está', () => {
    let carrito = carritoReducer([], { tipo: 'agregar', producto: leche })
    carrito = carritoReducer(carrito, { tipo: 'agregar', producto: leche })
    expect(carrito[0].cantidad).toBe(2)
  })

  it('no deja pasar del stock disponible', () => {
    let carrito = []
    for (let i = 0; i < 5; i++) carrito = carritoReducer(carrito, { tipo: 'agregar', producto: doritos })
    expect(carrito[0].cantidad).toBe(2)
  })

  it('restar en 1 elimina el producto', () => {
    const carrito = carritoReducer([{ ...leche, cantidad: 1 }], { tipo: 'restar', id: 1 })
    expect(carrito).toEqual([])
  })

  it('quitar elimina todas las unidades', () => {
    const carrito = carritoReducer([{ ...leche, cantidad: 4 }], { tipo: 'quitar', id: 1 })
    expect(carrito).toEqual([])
  })

  it('sincronizar ajusta precio, cantidad al stock y borra productos inexistentes', () => {
    const carrito = [
      { id: 1, nombre: 'Leche', precio: 4000, imagen: '', cantidad: 3 },
      { id: 2, nombre: 'Doritos', precio: 8000, imagen: '', cantidad: 5 },
      { id: 99, nombre: 'Borrado', precio: 1000, imagen: '', cantidad: 1 },
    ]
    const resultado = carritoReducer(carrito, { tipo: 'sincronizar', productos: PRODUCTOS })
    expect(resultado).toHaveLength(2)
    expect(resultado[0]).toMatchObject({ id: 1, precio: 5000, cantidad: 3 })
    expect(resultado[1]).toMatchObject({ id: 2, cantidad: 2 })
  })
})

describe('resumenCarrito', () => {
  it('cuenta unidades y subtotal', () => {
    expect(
      resumenCarrito([
        { precio: 5000, cantidad: 2 },
        { precio: 8000, cantidad: 1 },
      ])
    ).toEqual({ cantidad: 3, subtotal: 18000 })
  })
})

describe('leerCarritoGuardado', () => {
  it('devuelve [] si lo guardado está dañado', () => {
    localStorage.setItem('carrito', '{no es json')
    expect(leerCarritoGuardado()).toEqual([])
  })
})
