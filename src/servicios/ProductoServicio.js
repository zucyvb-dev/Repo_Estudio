/**Maneja la lágica del negocio de Producto y sus clases hijas estado e rentaProd */
const Producto = require('../modelos/Producto');
const Validador = require('../utiles/Validador');

class ProductoServicio {
    constructor(productoRepositorio) {
        this.productoRepo = productoRepositorio;
    }

    //Insertar un Producto
    insertarProducto(datosProducto) {
        if (!Validador.validarProducto(datosProducto)) throw new Error("Producto inválido");
        Validador.validarTextoNoVacio(datosProducto.id,"id");
        Validador.validarTextoNoVacio(datosProducto.nombre,"nombre");
        const producto = new Producto(
            datosProducto.id,
            datosProducto.nombre,
            datosProducto.categoria,
            datosProducto.precioVenta,
            datosProducto.rentable,
            null,   //rentaProd en null por defecto
            datosProducto.stock,
            null    //estado null
        );
        return this.productoRepo.insertarProducto(producto);
    }

    //Realizar el cálculo del costo de la renta según su modelo
    calcularCostoRenta(idProducto,dias,modelo) {
        const producto = this.productoRepo.buscarPorId(idProducto);
        if (!producto) throw new Error ('Producto no encontrado');

        let costo = 0;

        if (modelo === "POR_DIA") {
            if (!producto.rentaProd || !producto.rentaProd.precioDia) {
                throw new Error ('Precio por día no definido');
            }
            //Calculo el costo teniendo en cuenta los días
            costo = dias * producto.rentaProd.precioDia;
        } else if (modelo === "LINEAL") {
            if (!producto.rentaProd || !producto.rentaProd.precioLineal) {
                throw new Error ('Precio lineal no definido');
            }
            //Calculo el costo teniendo en cuenta los días
            costo = producto.rentaProd.precioLineal;
        } else {
            throw new Error ('Modelo de renta inválido');
        }
        
        return costo;
    }

    //Realizar el registro de una renta de un Producto
    registrarRentaProducto(idProducto,clienteId,dias,modelo) {
        const producto = this.productoRepo.buscarPorId(idProducto);
        if (!producto) throw new Error ('Producto no encontrado');

        if (!Validador.validarProductoRentable(producto)) throw new Error ('Producto no rentable');
        if (!Validador.validarEstadoProducto(producto)) throw new Error ('Producto ya está rentado');
        
        //Inicializar rentaProd si estaba null
        if (!producto.rentaProd) {
            producto.rentaProd = {modelo, precioDia: 10, precioLineal: 100};    //Objeto simple
        }
    
        //Calcular costo
        const costo = this.calcularCostoRenta(idProducto,dias,modelo);

        //Inicializar estado si estaba en null
        if (!producto.estado) {
            producto.estado = {rentado: false, clienteId: null};
        }

        //Actualizo el estado
        producto.estado.rentado = true;
        producto.estado.clienteId = clienteId;

        //Actualizo el producto
        this.productoRepo.actualizarProducto(idProducto,producto);
    
        return { producto, costo};
    }

    //Realizar la devolución del Producto
    devolverProducto(idProducto) {
        const producto = this.productoRepo.buscarPorId(idProducto);
        if (!producto) throw new Error ('Producto no encontrado');
        if (!producto.estado || !producto.estado.rentado) throw new Error ('El producto no estaba rentado');

        //Formatear a los valores iniciales el producto
        producto.estado.rentado = false;
        producto.estado.clienteId = null;

        //Actualizar el producto y devolverlo
        this.productoRepo.actualizarProducto(idProducto,producto);

        return producto;
    }

    //Actualizar el stock del producto
    actualizarStockProducto(idProducto,cantidad) {
        const producto = this.productoRepo.buscarPorId(idProducto);
        if (!producto) throw new Error ('Producto no encontrado');
        if (!Validador.validarStock(producto,cantidad)) throw new Error ('Stock insuficiente de ese producto');
        producto.stock -= cantidad;

        //Devuelvo el producto actualizado con el stock actual
        return this.productoRepo.actualizarProducto(idProducto,producto);
    }
}

module.exports = ProductoServicio;