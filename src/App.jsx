
import './App.css'
import { useState,useEffect } from 'react'
import BarraTotal from './components/BarraTotal'
import Header from './components/Header'
import PanelCarrito from './components/PanelCarrito'
import Hero from './components/Hero'
import ProductList from './components/ProductList'
import ProductCard from './components/ProductCard'
import { Toaster,toast } from 'sonner'




function App() {

 const [productos, setProductos] = useState([])
    

  const [carrito, setCarrito] = useState(() => {
  const guardado = localStorage.getItem('carrito')
  if (guardado) {
    return JSON.parse(guardado)
  } else {
    return []
  }
})

  function agregarAlCarrito(producto) {
    const productoAgregado = carrito.find((item) => item.id === producto.id)
    if (productoAgregado) {
      const nuevoCarrito = carrito.map((item) =>{
        if (item.id === producto.id) {
          return {
            ...item, cantidad: item.cantidad + 1,
          }
          
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
        const nuevoProductos = productos.map((item) =>{
            if (item.id === producto.id) {
          return {
            ...item, stock: item.stock - 1,
          }
          
        } else{
          return item
        }
      })
      setProductos (nuevoProductos)

      fetch(`http://localhost:3000/productos/${producto.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ stock: producto.stock - 1 })
       })
      toast.success(`Agregaste ${producto.nombre} al carrito`)

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

     const devolverStock = productos.map((item) =>{
            if (item.id === id) {
          return {
            ...item, stock: item.stock + 1,
          }
          
        } else{
          return item
        }
      })
      setProductos (devolverStock)

         const productoActual = productos.find((p) => p.id === id)

      fetch(`http://localhost:3000/productos/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ stock: productoActual.stock + 1 })
       })

      toast.info(`Eliminaste ${item.nombre} del carrito`)
    }


    function borrarCarrito () {
     const devolverStock = productos.map((item) =>{
     const idProductos = carrito.find ((i) =>  i.id === item.id )
          if (idProductos) {
          fetch(`http://localhost:3000/productos/${item.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ stock: item.stock + idProductos.cantidad})
       })
         return { ...item, stock: item.stock + idProductos.cantidad } 
        } else{
          return item 
      }  
      })
      setProductos (devolverStock)

      setCarrito([])

      toast.info(`Eliminaste toda tu compra`)

    }
  
    const [panelAbierto,setPanelAbierto] = useState(false)
    function togglePanel() {
      setPanelAbierto(!panelAbierto)
    }

    function cerrarPanel() {
      setPanelAbierto(false)
    }

    function pagar(){
      toast.success('Compra exitosa')
    }

    /*useEffect(() =>{
      localStorage.setItem('productos', JSON.stringify(productos))
    },[productos])*/


    useEffect(() => {
  fetch('http://localhost:3000/productos')
    .then((respuesta) => respuesta.json())
    .then((datos) => {
      setProductos(datos)
    })
}, [])

    useEffect(() =>{
      localStorage.setItem('carrito', JSON.stringify(carrito) )
    },[carrito])
  return (
    <>
   <Toaster/>
   <Header togglePanel = {togglePanel} />

   <Hero/>

   <ProductList productos = {productos} agregarAlCarrito = {agregarAlCarrito}/>


   <PanelCarrito carrito = {carrito} eliminarDelCarrito = {eliminarDelCarrito} panelAbierto ={panelAbierto} cerrarPanel={cerrarPanel}  borrarCarrito={borrarCarrito} pagar={pagar}/>
    
    <BarraTotal carrito = {carrito} />
    </>
  )
}

export default App
