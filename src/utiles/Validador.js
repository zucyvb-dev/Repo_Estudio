/**Maneja las validaciones generales del proyecto */

class Validador {
    
    /**Validaciones de Cliente y de los elementos que componen sus clases hijas contacto e historial */
    //Verificar si el cliente está activo
    static validarClienteActivo(activo) {
        if (typeof activo !== "boolean") {
            throw new Error("El estado del cliente debe ser booleano");            
        }
        return activo === true;
    }

    //Verificar si el formato del email es válido
    static validarEmail(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    }

    //Verificar si el formato del teléfono es válido
    static validarTelefono(telefono) {
        return typeof telefono === 'string' && telefono.replace(/\D/g, '').length >= 7;
    }

    //Verificar si la venta es válida
    static validarVenta(venta) {
        return venta && venta.id && venta.productoId && venta.total >= 0;
    }
    
    //Verificar si la renta es válida
    static validarRenta(renta) {
        return renta && renta.id && renta.productoId && renta.costo >= 0;
    }

    /**Validaciones de Producto y de los elementos que componen sus clases hijas estado e rentaProd */
    //Validar los datos básicos un producto
    static validarProducto(datosProducto) {
        return datosProducto.id && datosProducto.nombre && this.validarPrecioVentaProducto(datosProducto) && this.validarStock(datosProducto,0);
    }

    //Validar si el producto es rentable
    static validarProductoRentable(producto) {
        return producto.rentable === true;
    }

    //Validar el estado de un producto está disponible (no rentado)
    static validarEstadoProducto(producto) {
        return producto.estado && producto.rentable === false;
    }

    //Validar si tiene stock suficiente
    static validarStock(producto, cantidad) {
        return producto.stock >= cantidad;
    }

    //Validar el precio de venta positivos del producto
    static validarPrecioVentaProducto(producto) {
        return producto.precioVenta > 0;
    }
}

module.exports = Validador;
