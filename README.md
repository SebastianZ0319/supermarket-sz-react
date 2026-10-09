# Supermarket SZ — Frontend

Tienda en línea hecha con React + Vite. Se conecta al backend `supermarket-sz-backend` (Express + MySQL).

## Funciones

- Catálogo con búsqueda, filtros por categoría, ofertas y orden (los filtros viven en la URL)
- Detalle de producto en ventana modal (`/?producto=3`)
- Carrito lateral con envío gratis desde $50.000; se guarda en el navegador
- Checkout (`/checkout`): el stock se descuenta en el backend **solo al confirmar el pedido**
- Panel de administración (`/admin`): productos (crear, editar, eliminar, stock) y pedidos (cambiar estado, cancelar)
- Modo claro / oscuro y diseño adaptado a celular

## Puesta en marcha

1. Levanta el backend (ver su README) en `http://localhost:3000`.
2. Copia la configuración y arranca:

```bash
cp .env.example .env   # VITE_API_URL=http://localhost:3000
npm install
npm run dev
```

## Scripts

| Comando | Qué hace |
|---|---|
| `npm run dev` | Servidor de desarrollo |
| `npm run build` | Compila para producción en `dist/` |
| `npm test` | Ejecuta las pruebas (Vitest + Testing Library) |
| `npm run lint` | Revisa el código con ESLint |
| `npm run imagenes` | Convierte los `.png` de `public/Fotos` a `.webp` cuadrados de 600×600 |

## Estructura

```
src/
  api/cliente.js          Llamadas al backend (usa VITE_API_URL)
  context/                Estado global: tienda/carrito y tema
  pages/                  Tienda, Checkout, Confirmación, Admin, 404
  components/             Componentes de la tienda
  components/admin/       Componentes del panel de administración
  utils/                  Lógica pura (carrito, filtros, validaciones, formato)
  styles/                 Estilos de checkout y admin
  index.css               Sistema de diseño: colores, espaciado, tipografía, modo oscuro
```

## Agregar imágenes de productos

Copia el `.png` a `public/Fotos/` y ejecuta `npm run imagenes`. Luego, en el panel de administración, usa la ruta `Fotos/nombre.webp`.
