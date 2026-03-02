/**Maneja el modelo de las Ventas */
/**Requiere la clase auxiliar Item */

const ItemVenta = require("./Item");

class Venta {
    constructor(id,clienteId,items,subtotal,taxId,total,fechaISO) {
        this.id = id;
        this.clienteId = clienteId;

        //Uso exclusivo de Venta
        this.items = items.map(
            item => item instanceof ItemVenta ? item : new ItemVenta(item.productoId,item.cantidad,item.precioUnitario)
        );

        this.subtotal = subtotal;
        this.taxId = taxId;
        this.total = total;
        this.fechaISO = fechaISO;
    }
}

module.exports = Venta;