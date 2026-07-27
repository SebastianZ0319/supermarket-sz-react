function Header( {togglePanel} ) {
    return(

        <div id="header">
      <h1>Supermarket SZ</h1>
      <button id="abrirPanel" onClick={() => {togglePanel()} } >🛒 Carrito</button>
    </div>
      
    )
}

export default Header