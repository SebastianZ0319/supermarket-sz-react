import { createContext, useContext, useEffect, useState } from 'react'

const TemaContext = createContext(null)

function temaInicial() {
  try {
    const guardado = localStorage.getItem('tema')
    if (guardado === 'claro' || guardado === 'oscuro') return guardado
  } catch {
    // sin acceso a localStorage: se usa la preferencia del sistema
  }
  return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'oscuro' : 'claro'
}

export function TemaProvider({ children }) {
  const [tema, setTema] = useState(temaInicial)

  useEffect(() => {
    document.documentElement.dataset.tema = tema
    try {
      localStorage.setItem('tema', tema)
    } catch {
      // no pasa nada si no se puede guardar
    }
  }, [tema])

  const alternarTema = () => setTema((t) => (t === 'oscuro' ? 'claro' : 'oscuro'))

  return <TemaContext.Provider value={{ tema, alternarTema }}>{children}</TemaContext.Provider>
}

export function useTema() {
  return useContext(TemaContext)
}
