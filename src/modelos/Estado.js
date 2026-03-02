/**Manejo del modelo de estado como clase auxiliar de Producto */

class Estado {
    constructor(rentado,clienteId) {
        this.rentado = rentado;
        this.clienteId = clienteId;
    }
}

module.exports = Estado;