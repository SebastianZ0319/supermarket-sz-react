function Marca({ sufijo }) {
  return (
    <span className="marca">
      <img src={`${import.meta.env.BASE_URL}Fotos/logo.webp`} alt="" className="marca-logo" width="54" height="32" />
      <span className="marca-nombre">
        Supermarket <strong>SZ</strong>
        {sufijo && <span className="marca-sufijo">{sufijo}</span>}
      </span>
    </span>
  )
}

export default Marca
