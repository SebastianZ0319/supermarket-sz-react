import ProductCard from "./ProductCard";



function ProductList({productos, agregarAlCarrito}) {

    return(
        <ul id="myProducts">
    {productos.map((producto) => 
    (<ProductCard key={producto.id} producto = {producto} agregarAlCarrito = {agregarAlCarrito} />

    ))}
        </ul>
    )
    
}

export default ProductList