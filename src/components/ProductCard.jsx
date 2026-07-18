import { precioCop } from "../utils/preciCop"



function ProductCard({producto, agregarAlCarrito}) {
    return(

    <li className="info">
    <div className="card-img">
        <img src={producto.imagen} className="imagenes" />
    </div>
    <span className="card-name">{producto.nombre}:</span>
    <span className="card-price">{precioCop.format(producto.precio)} </span>
    <button onClick={ ()=> agregarAlCarrito(producto)} className="agregar">Agregar</button>
    </li>
    
    )
    
}

export default ProductCard