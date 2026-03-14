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

        this.subtotal = Number.isFinite(Number(subtotal)) ? Number(subtotal) : 0;
        this.taxId = Number.isFinite(Number(taxId)) ? Number(taxId) : 0;
        this.total = Number.isFinite(Number(total)) ? Number(total) : 0;
        this.fechaISO = fechaISO;
    }
}

module.exports = Venta;