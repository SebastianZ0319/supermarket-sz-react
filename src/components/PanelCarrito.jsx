import { precioCop } from "../utils/preciCop"





function PanelCarrito({ carrito, eliminarDelCarrito,panelAbierto }) {

    const total = carrito.reduce((acomulador, item) =>{

        return acomulador + item.precio * item.cantidad
    },0)

    return(
        <div id="panelCarrito" style={{ display: panelAbierto ? 'flex' : 'none'}}>
            <h2>Tu carrito</h2>
      <ul id="canasta">{carrito.map((item) => (
    <li key={item.id} className="info">
      <img src={item.imagen} className="imagenesCarrito" />
      <span className="card-name">{item.nombre}: </span>
      <span className="card-price">
        {precioCop.format(item.precio * item.cantidad)} x{item.cantidad}
      </span>

      <button onClick={() => eliminarDelCarrito(item.id)} className="eliminar">Eliminar</button>
    </li>))}
  </ul>
       
      <div id="totalCarrito"> {precioCop.format(total)}</div>

      <div id="botonBorrarTodo"></div>

      <div id="cerrarCarrito">
        <img id="btnCerrar" src='Fotos/x.svg' width="40" height="40" />
      </div>
        </div>

    )
}

export default PanelCarrito