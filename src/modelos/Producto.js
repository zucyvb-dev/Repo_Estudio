/**Manejo del modelo de Producto */
/**Se requiere las clases auxiliares rentaprod y estado */
const RentaProd = require('./RentaProd');
const Estado = require('./Estado');

class Producto {
    constructor(id, nombre, categoria,precioVenta,rentable,rentaProd,stock,estado) {
        this.id = id;
        this.nombre = nombre;
        this.categoria = categoria;
        this.precioVenta = precioVenta;
        this.rentable = rentable;

        //Es de uso exclusivo de Producto
        this.rentaProd = rentaProd instanceof RentaProd
            ? rentaProd
            : new RentaProd(rentaProd.modelo,rentaProd.precioDia,rentaProd.precioLineal);

        this.stock = stock;

        //Uso exclusivo de Producto
        this.estado = estado instanceof Estado  
            ? estado
            : new Estado(estado.rentado,estado.clienteId);
    }
}

module.exports = Producto;