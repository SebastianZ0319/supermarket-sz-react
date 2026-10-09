import { describe, expect, it, vi } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router'
import { TemaProvider } from '../context/TemaContext'
import { TiendaProvider } from '../context/TiendaContext'
import Layout from '../components/Layout'
import Tienda from './Tienda'
import { PRODUCTOS } from '../test/datos'

function renderizarTienda(ruta = '/') {
  vi.spyOn(globalThis, 'fetch').mockResolvedValue(
    new Response(JSON.stringify(PRODUCTOS), { status: 200, headers: { 'Content-Type': 'application/json' } })
  )
  render(
    <MemoryRouter initialEntries={[ruta]}>
      <TemaProvider>
        <TiendaProvider>
          <Routes>
            <Route element={<Layout />}>
              <Route index element={<Tienda />} />
            </Route>
          </Routes>
        </TiendaProvider>
      </TemaProvider>
    </MemoryRouter>
  )
}

describe('Tienda', () => {
  it('carga y muestra los productos del servidor', async () => {
    renderizarTienda()
    expect(await screen.findByText('3 productos')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Leche' })).toBeInTheDocument()
  })

  it('filtra con el buscador', async () => {
    renderizarTienda()
    await screen.findByText('3 productos')
    await userEvent.type(screen.getByRole('searchbox', { name: 'Buscar productos' }), 'dori')
    expect(screen.getByText('1 producto')).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Leche' })).not.toBeInTheDocument()
  })

  it('muestra la categoría Ofertas solo si hay productos en oferta', async () => {
    renderizarTienda()
    await screen.findByText('3 productos')
    await userEvent.click(screen.getByRole('button', { name: 'Ofertas' }))
    expect(screen.getByText('1 producto')).toBeInTheDocument()
  })

  it('agregar actualiza el contador y el carrito', async () => {
    renderizarTienda()
    await screen.findByText('3 productos')
    await userEvent.click(screen.getByRole('button', { name: 'Agregar Leche al carrito' }))
    await userEvent.click(screen.getByRole('button', { name: 'Sumar un Leche' }))

    await userEvent.click(screen.getByRole('button', { name: 'Abrir carrito, 2 productos' }))
    const panel = screen.getByRole('dialog', { name: 'Carrito de compras' })
    expect(within(panel).getByText('Leche')).toBeInTheDocument()
    expect(within(panel).getByText('(2)')).toBeInTheDocument()
    expect(JSON.parse(localStorage.getItem('carrito'))[0].cantidad).toBe(2)
  })

  it('abre el detalle desde la URL', async () => {
    renderizarTienda('/?producto=2')
    const detalle = await screen.findByRole('dialog', { name: 'Doritos' })
    expect(within(detalle).getByText('2 unidades disponibles')).toBeInTheDocument()
  })

  it('muestra un error si el servidor no responde', async () => {
    vi.spyOn(globalThis, 'fetch').mockRejectedValue(new TypeError('Failed to fetch'))
    render(
      <MemoryRouter>
        <TemaProvider>
          <TiendaProvider>
            <Tienda />
          </TiendaProvider>
        </TemaProvider>
      </MemoryRouter>
    )
    expect(await screen.findByText('No pudimos cargar los productos')).toBeInTheDocument()
  })
})
