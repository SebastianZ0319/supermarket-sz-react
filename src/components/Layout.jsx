import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router'
import { Toaster } from 'sonner'
import { useTema } from '../context/TemaContext'
import Header from './Header'
import Footer from './Footer'
import PanelCarrito from './PanelCarrito'
import BarraCarritoMovil from './BarraCarritoMovil'

function Layout() {
  const { tema } = useTema()
  const { pathname } = useLocation()
  const enCheckout = pathname === '/checkout'

  // Al cambiar de página se vuelve arriba
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return (
    <>
      <Toaster position="top-center" richColors closeButton theme={tema === 'oscuro' ? 'dark' : 'light'} />
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
      {!enCheckout && <BarraCarritoMovil />}
      <PanelCarrito />
    </>
  )
}

export default Layout
