/**Maneja el modelo de las Rentas */

class Renta {
    constructor(id,clienteId,productoId,modelo,dias,costo,fechaISO,devuelta) {
        this.id = id;
        this.clienteId = clienteId;
        this.productoId = productoId;
        this.modelo = modelo;
        this.dias = Number.isFinite(Number(dias)) ? Number(dias) : 0;
        this.costo = Number.isFinite(Number(costo)) ? Number(costo) : 0;
        this.fechaISO = fechaISO;
        this.devuelta = Boolean(devuelta);
    }
}

module.exports = Renta;