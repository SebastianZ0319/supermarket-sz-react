
import './App.css'
import { useState } from 'react'
import BarraTotal from './components/BarraTotal'
import Header from './components/Header'
import PanelCarrito from './components/PanelCarrito'
import Hero from './components/Hero'
import ProductList from './components/ProductList'
import ProductCard from './components/ProductCard'




function App() {

  const [productos, setProductos] = useState([
    {
    id: 1,
    nombre: 'Caco-cacola',
    precio: 4500,
    stock: 5,
    imagen: 'Fotos/coca-cola.png'
  },
  {
    id: 2,
    nombre: 'Doritos',
    precio: 8000,
    stock: 3,
    imagen: 'Fotos/doritos.png'
  },
  {
    id: 3,
    nombre: 'Gomitas',
    precio: 2000,
    stock: 6,
    imagen: 'Fotos/gomitas.png'
  },
  {
    id: 4,
    nombre: 'Papel',
    precio: 3000,
    stock: 1,
    imagen: 'Fotos/papel.png'
  },
  {
    id: 5,
    nombre: 'Cafe',
    precio: 9000,
    stock: 2,
    imagen: 'Fotos/cafe.png'
  },
  {
    id: 6,
    nombre: 'Jabon',
    precio: 18000,
    stock: 7,
    imagen: 'Fotos/jabon_loza.png'
  },
  {
    id: 7,
    nombre: 'Crema dental',
    precio: 15000,
    stock: 4,
    imagen: 'Fotos/crema_dental.png'
  },
  {
    id: 8,
    nombre: 'Leche',
    precio: 5000,
    stock: 8,
    imagen: 'Fotos/leche.png'
  },
  {
    id: 9,
    nombre: 'Arroz',
    precio: 12000,
    stock: 10,
    imagen: 'Fotos/arroz.png'
  },
  {
    id: 10,
    nombre: 'pasta',
    precio: 7000,
    stock: 5,
    imagen: 'Fotos/pasta.png'
  },
  {
    id: 11,
    nombre: 'Atun',
    precio: 6000,
    stock: 3,
    imagen: 'Fotos/atun.png'
  },
  {
    id: 12,
    nombre: 'Salchichas',
    precio: 8000,
    stock: 2,
    imagen: 'Fotos/salchichas.png'
  }
  ])

  const [carrito, setCarrito] = useState([])
  function agregarAlCarrito(producto) {
    const productoAgregado = carrito.find((item) => item.id === producto.id)
    if (productoAgregado) {
      const nuevoCarrito = carrito.map((item) =>{
        if (item.id === producto.id) {
          return {
            ...item, cantidad: item.cantidad + 1}
        } else{
          return item
        }
      })
      setCarrito (nuevoCarrito)
    } else{
           const nuevoItem = 
               ({
                id: producto.id,
                nombre: producto.nombre,
                precio: producto.precio,
                cantidad: 1,
               imagen: producto.imagen
              })   

           setCarrito([...carrito, nuevoItem])
        }
    }

    function eliminarDelCarrito(id) {
      const item = carrito.find((item)=> item.id === id)

     if (item.cantidad > 1) {
      const nuevoCarrito = carrito.map((item) =>{
        if (item.id === id) {
          return {
            ...item, cantidad: item.cantidad - 1}
        } else{
          return item
        }
      })
      setCarrito(nuevoCarrito)
     } else {
      const nuevoCarrito = carrito.filter((item) => item.id !== id)

      setCarrito(nuevoCarrito)
     }
    }
  

    const [panelAbierto,setPanelAbierto] = useState(false)
    function togglePanel() {
      setPanelAbierto(!panelAbierto)
    }
  return (
    <>
   
   <Header togglePanel = {togglePanel} />

   <Hero/>

   <ProductList productos = {productos} agregarAlCarrito = {agregarAlCarrito}/>


   <PanelCarrito carrito = {carrito} eliminarDelCarrito = {eliminarDelCarrito} panelAbierto ={panelAbierto} />
    
    <BarraTotal carrito = {carrito} />
    </>
  )
}

export default App
