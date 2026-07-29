import { precioCop } from "../utils/preciCop"



function ProductCard({producto, agregarAlCarrito}) {
    return(

    <li className="info">
    <div className="card-img">
        <img src={producto.imagen} className="imagenes" />
    </div>
    <span className="card-name">{producto.nombre}:</span>

    <span className="card-price">{precioCop.format(producto.precio)} </span>

    <span className="card-stock">Stock: {producto.stock}</span>

    <button disabled={producto.stock <= 0}  
    onClick={ ()=> agregarAlCarrito(producto)} 
    className= {producto.stock <= 0 ? 'agotado' : 'agregar'} > 
    {producto.stock <= 0 ? 'Agotado' : 'Agregar ' }  
    </button>
    </li>
    
    )
    
}

export default ProductCard