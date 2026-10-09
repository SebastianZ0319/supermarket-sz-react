import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ProductCard from './ProductCard'
import { PRODUCTOS } from '../test/datos'

const [leche, doritos, cafe] = PRODUCTOS

function renderizar(producto, enCarrito = 0) {
  const props = { agregar: vi.fn(), restar: vi.fn(), verDetalle: vi.fn() }
  render(
    <ul>
      <ProductCard producto={producto} enCarrito={enCarrito} {...props} />
    </ul>
  )
  return props
}

describe('ProductCard', () => {
  it('agrega al carrito con el botón +', async () => {
    const { agregar } = renderizar(leche)
    await userEvent.click(screen.getByRole('button', { name: 'Agregar Leche al carrito' }))
    expect(agregar).toHaveBeenCalledWith(leche)
  })

  it('muestra el stepper cuando ya está en el carrito', async () => {
    const { restar } = renderizar(leche, 2)
    expect(screen.getByLabelText('2 en el carrito')).toBeInTheDocument()
    await userEvent.click(screen.getByRole('button', { name: 'Restar un Leche' }))
    expect(restar).toHaveBeenCalledWith(1)
  })

  it('no deja sumar más del stock', () => {
    renderizar(doritos, 2)
    expect(screen.getByRole('button', { name: 'Sumar un Doritos' })).toBeDisabled()
  })

  it('muestra oferta y últimas unidades', () => {
    renderizar(doritos)
    expect(screen.getByText('-20%')).toBeInTheDocument()
    expect(screen.getByText('¡Últimas 2!')).toBeInTheDocument()
    expect(screen.getByText('$ 10.000', { normalizer: (t) => t.replace(/\s/g, ' ') })).toBeInTheDocument()
  })

  it('deshabilita productos agotados', () => {
    renderizar(cafe)
    expect(screen.getByText('Agotado')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Agregar Café al carrito' })).toBeDisabled()
  })

  it('abre el detalle al tocar el nombre', async () => {
    const { verDetalle } = renderizar(leche)
    await userEvent.click(screen.getByRole('button', { name: 'Leche' }))
    expect(verDetalle).toHaveBeenCalledWith(leche)
  })
})
