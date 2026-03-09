/**Manejo del modelo de estado como clase auxiliar de Producto */

class Estado {
    constructor(rentado = false, clienteId = null) {
        this.rentado = rentado;
        this.clienteId = clienteId;
    }

    //Actualizar el estado del Producto
    actualizarEstado(rentado, clienteId) {
        this.rentado = rentado;
        this.clienteId = clienteId;
    }
}

module.exports = Estado;