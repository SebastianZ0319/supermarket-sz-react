// Convierte las fotos de productos a WebP cuadradas y del mismo tamaño.
// Uso: npm run imagenes  (lee public/Fotos/*.png y escribe los .webp al lado)
import { readdir, unlink } from 'node:fs/promises'
import path from 'node:path'
import sharp from 'sharp'

const CARPETA = 'public/Fotos'
const LIENZO = 600
const CONTENIDO = 520 // deja un margen uniforme alrededor del producto

const archivos = (await readdir(CARPETA)).filter((f) => f.endsWith('.png'))

for (const archivo of archivos) {
  const origen = path.join(CARPETA, archivo)
  const esLogo = archivo.toLowerCase() === 'logo.png'

  if (esLogo) {
    await sharp(origen).trim().resize({ height: 96 }).webp({ quality: 90 }).toFile(path.join(CARPETA, 'logo.webp'))
    await sharp(origen).trim().resize(64, 64, { fit: 'contain', background: '#0000' }).png().toFile('public/favicon.png')
  } else {
    const producto = await sharp(origen)
      .trim() // quita bordes vacíos para que todos los productos ocupen lo mismo
      .resize(CONTENIDO, CONTENIDO, { fit: 'inside' })
      .toBuffer()
    const { width, height } = await sharp(producto).metadata()

    await sharp({
      create: { width: LIENZO, height: LIENZO, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } },
    })
      .composite([{ input: producto, left: Math.round((LIENZO - width) / 2), top: Math.round((LIENZO - height) / 2) }])
      .webp({ quality: 82 })
      .toFile(path.join(CARPETA, archivo.replace('.png', '.webp')))
  }

  await unlink(origen)
  console.log(`✓ ${archivo}`)
}
