export class ErrorApi extends Error {
  constructor(mensaje, estado, datos) {
    super(mensaje)
    this.estado = estado
    this.datos = datos
  }
}
