/**Maneja el modelo de item como clase auxiliar de Venta */

class Item {
    constructor(productoId,cantidad,precioUnitario) {
        this.productoId = productoId;
        this.cantidad = cantidad;
        this.precioUnitario = precioUnitario;
    }

    calcularSubTotal(){
        return this.cantidad * this.precioUnitario;
    }
}

module.exports = Item;