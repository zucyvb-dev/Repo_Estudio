/**Manejo del modelo de Producto */
/**Se requiere las clases auxiliares rentaprod y estado */
const RentaProd = require('./RentaProd');
const Estado = require('./Estado');

class Producto {
    constructor(id, nombre, categoria, precioVenta, rentable, renta = {}, stock, estado = {}) {
        this.id = id;
        this.nombre = nombre;
        this.categoria = categoria;
        this.precioVenta = Number.isFinite(Number(precioVenta)) ? Number(precioVenta) : 0;
        this.rentable = Boolean(rentable);

        // Uso exclusivo de Producto: rentaProd
        this.rentaProd = renta instanceof RentaProd
            ? renta
            : (renta && typeof renta === 'object')
            ? new RentaProd(
                renta.modelo || 'LINEAL',
                Number.isFinite(Number(renta.precioDia)) ? Number(renta.precioDia) : 0,
                Number.isFinite(Number(renta.precioLineal)) ? Number(renta.precioLineal) : 0
                )
            : null;
        
        this.stock = Number.isFinite(Number(stock)) ? Number(stock) : 0;

        // Uso exclusivo de Producto: estado
        this.estado = estado instanceof Estado
            ? estado
            : new Estado(
                (estado && estado.rentado) ? estado.rentado : false,
                (estado && estado.clienteId) ? estado.clienteId : null
              );
    }

    actualizarProducto({nombre, categoria, precioVenta, rentable, stock}) {
        if (nombre) this.nombre = nombre;
        if (categoria) this.categoria = categoria;
        if (precioVenta !== undefined) this.precioVenta = precioVenta;
        if (rentable !== undefined) this.rentable = rentable;
        if (stock !== undefined) this.stock = stock;
    }
}

module.exports = Producto;