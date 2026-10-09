import '@testing-library/jest-dom/vitest'
import { afterEach, vi } from 'vitest'
import { cleanup } from '@testing-library/react'

afterEach(() => {
  cleanup()
  localStorage.clear()
  vi.restoreAllMocks()
})

// jsdom no implementa scrollTo ni matchMedia
window.scrollTo = () => {}
window.matchMedia ??= () => ({ matches: false, addEventListener() {}, removeEventListener() {} })
