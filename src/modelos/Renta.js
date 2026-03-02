/**Maneja el modelo de las Rentas */

class Renta {
    constructor(id,clienteId,productoId,modelo,dias,costo,fechaISO,devuelta) {
        this.id = id;
        this.clienteId = clienteId;
        this.productoId = productoId;
        this.modelo = modelo;
        this.dias = dias;
        this.costo = costo;
        this.fechaISO = fechaISO;
        this.devuelta = devuelta;
    }
}

module.exports = Renta;