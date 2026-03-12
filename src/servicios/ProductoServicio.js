/**Maneja la lágica del negocio de Producto y sus clases hijas estado e rentaProd */
const Producto = require('../modelos/Producto');
const Validador = require('../utiles/Validador');

class ProductoServicio {
    constructor(productoRepositorio,rentaServicio) {
        this.productoRepo = productoRepositorio;
        this.rentaServ = rentaServicio;
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

    //Realizar el registro de una renta de un Producto
    registrarRentaProducto(renta) {
        const producto = this.productoRepo.buscarPorId(renta.productoId);
        if (!producto) throw new Error ('Producto no encontrado');

        if (!Validador.validarProductoRentable(producto)) throw new Error ('Producto no rentable');
        if (!Validador.validarEstadoProducto(producto)) throw new Error ('Producto ya está rentado');
        if (!Validador.validarStock(producto)) throw new Error ('Producto sin stock disponible. ');
        
        //Calcular costo        
        producto.costo = this.rentaServ.calcularCostoRenta(renta.productoId,renta.dias,renta.modelo);

        //Insertar la renta
        this.rentaServ.registrarRenta(renta);

        //Inicializar estado si estaba en null
        if (!producto.estado) {
            producto.estado = {rentado: false, clienteId: null};
        }

        //Actualizo el estado y el campo rentable
        producto.rentable = false;
        producto.estado = {rentado: true, clienteId: renta.clienteId};

        //Actualizar el registro de la rentaProd del Producto
        producto.rentaProd = {
            modelo: renta.modelo,
            precioDia: producto.precioDia,
            precioLineal: producto.precioLineal
        }

        //Reducir el stock
        producto.stock -= 1;
    
        //Actualizo el producto
        this.productoRepo.actualizarProducto(idProducto,producto);

        return { 
            mensaje: "Renta del producto registrada satisfactoriamente. ",
            renta,
            producto};
    }

    //Realizar la devolución del Producto
    devolverProducto(clienteId,idProducto) {
        const producto = this.productoRepo.buscarPorId(idProducto);
        if (!producto) throw new Error ('Producto no encontrado');
        if (!producto.estado || !producto.estado.rentado) throw new Error ('El producto no estaba rentado');

        //Validar clienteId
        const renta = this.rentaServ.rentaRepo.mostrarTodo()
            .filter(r => r.clienteId === clienteId && r.productoId === idProducto);
        
        if (!Validador.validarRenta(renta)) throw new Error ('Renta inválida');
        
        //Marcar la renta como devuelta
        this.rentaServ.devolverRenta(renta);

        //Formatear a los valores iniciales el producto
        producto.rentable = true;
        producto.estado = {rentado: false, clienteId: null};
        producto.rentaProd = null;

        //Actualizar el stock del producto para reestablecerlo
        producto.stock += 1;

        //Actualizar el producto y devolverlo
        this.productoRepo.actualizarProducto(renta.productoId,producto);

        return { 
            mensaje: "Renta del producto devuelta satisfactoriamente. ",
            renta,
            producto};
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