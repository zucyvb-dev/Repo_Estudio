/**Maneja el modelo de item como clase auxiliar de Venta */

class Item {
    constructor(productoId,cantidad,precioUnitario) {
        this.productoId = productoId;
        this.cantidad = Number.isFinite(Number(cantidad)) ? Number(cantidad) : 0;
        this.precioUnitario = Number.isFinite(Number(precioUnitario)) ? Number(precioUnitario) : 0; ;
    }

    calcularSubTotal(){
        return this.cantidad * this.precioUnitario;
    }
}

module.exports = Item;