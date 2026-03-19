/**Maneja la creación de fábrica de Productos */
const Producto = require('../modelos/Producto');
const Validador = require('../utiles/Validador');

class ProductoFabrica {
    static crearProducto(id,datosProducto) {
        Validador.validarTextoNoVacio(String(id), "id");
        Validador.validarTextoNoVacio(String(datosProducto.nombre), "nombre");
        Validador.validarTextoNoVacio(String(datosProducto.categoria), "categoria");
        Validador.validarPrecioVentaProducto(datosProducto);

        const precioVenta = Number(datosProducto.precioVenta) || 0;
        const rentable = datosProducto.rentable === true || datosProducto.rentable === 'true';
        const stock = Number(datosProducto.stock) || 0;

        return new Producto(
            id,
            datosProducto.nombre,
            datosProducto.categoria,
            precioVenta,
            rentable,
            datosProducto.renta ?? null,
            stock,
            datosProducto.estado ?? { rentado: false, clienteId: null }
        );
    }
}

module.exports = ProductoFabrica;
