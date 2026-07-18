import { precioCop } from "../utils/preciCop"


function BarraTotal( {carrito} ) {

 const totalProducto = carrito.reduce((acumulador, item) =>{
  return acumulador +  item.cantidad
 },0)

 const total = carrito.reduce((acomulador, item) =>{

        return acomulador + item.precio * item.cantidad
    },0)

    return(
        <div id="barraTotal">
      <span id="tProductos"> Productos {totalProducto} </span>
      <span id="contador">Total {precioCop.format(total)} </span>
    </div>

    )
    
}
export default BarraTotal