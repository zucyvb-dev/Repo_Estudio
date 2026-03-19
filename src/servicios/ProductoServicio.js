/**Maneja la lágica del negocio de Producto y sus clases hijas estado e rentaProd */
const ProductoFabrica = require('../fabricas/ProductoFabrica');
const Validador = require('../utiles/Validador');

class ProductoServicio {
    constructor(productoRepositorio,rentaServicio, notificador) {
        this.productoRepo = productoRepositorio;
        this.rentaServ = rentaServicio;
        this.notificador = notificador;
    }

    //Insertar un Producto
    insertarProducto(datosProducto) {
        //Validaciones de los datos del Producto
        if (!Validador.validarProducto(datosProducto)) throw new Error("Producto inválido");
        
        //Valida los atributos de Cliente
        Validador.validarTextoNoVacio(datosProducto.nombre, "nombre");

        const precioVenta = Number.isFinite(Number(datosProducto.precioVenta))
            ? Number(datosProducto.precioVenta)
            : 0;

        const rentable = datosProducto.rentable === true || datosProducto.rentable === 'true';
        const stock = Number.isFinite(Number(datosProducto.stock)) ? Number(datosProducto.stock) : 0;

        //Genero el IDs
        const nuevoId = this.productoRepo.generarIdProducto();
        
        const producto = ProductoFabrica.crearProducto(
            nuevoId,                                               //Autoincremental
            {
                nombre: datosProducto.nombre,
                categoria: datosProducto.categoria,
                precioVenta: precioVenta,                          // precioVenta directo
                rentable: rentable,                                // rentable
                renta: datosProducto.rentaProd ?? null,            // rentaProd
                stock: stock,                                      // stock
                estado: datosProducto.estado ?? { rentado: false, clienteId: null } // estado inicial seguro
            }
        );
        
        // Notificar inserción a los observadores
        this.notificador.notificar("PRODUCTO_INSERTADO", producto);

        //Insertar el producto y devolverlo
        return this.productoRepo.insertarProducto(producto);        

    }

    //Realizar el registro de una renta de un Producto
    registrarRentaProducto(renta) {
        
        const producto = this.productoRepo.buscarPorId(renta.productoId);
        
        if (!producto) throw new Error ('Producto no encontrado');

        if (!Validador.validarProductoRentable(producto)) throw new Error ('Producto no rentable');
        if (!Validador.validarEstadoProducto(producto)) throw new Error ('Producto ya está rentado');
        if (!Validador.validarStock(producto)) throw new Error ('Producto sin stock disponible. ');
        
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
            precioDia: producto.rentaProd?.precioDia,
            precioLineal: producto.rentaProd?.precioLineal
        };

        //Insertar la renta
        this.rentaServ.registrarRenta(renta,producto);

        //Reducir el stock
        producto.stock -= 1;
    
        //Actualizo el producto
        this.productoRepo.actualizarProducto(renta.productoId,producto);

        // Notificar renta a los observadores
        this.notificador.notificar("PRODUCTO_RENTADO", renta);

        return { 
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
            .find(r => r.clienteId === clienteId && r.productoId === idProducto);
        
        console.log("ProductoServicio: ", renta);
        
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

        // Notificar devolución a los observadores
        this.notificador.notificar("PRODUCTO_DEVUELTO", renta);

        return { 
            renta,
            producto};
    }

    //Actualizar el stock del producto
    actualizarStockProducto(idProducto,cantidad) {
        const producto = this.productoRepo.buscarPorId(idProducto);
        if (!producto) throw new Error ('Producto no encontrado');
        if (!Validador.validarStock(producto,cantidad)) throw new Error ('Stock insuficiente de ese producto');
        producto.stock -= cantidad;

        // Notificar devolución a los observadores
        this.notificador.notificar("STOCK_ACTUALIZADO", { idProducto, producto});

        //Devuelvo el producto actualizado con el stock actual
        return this.productoRepo.actualizarProducto(idProducto,producto);
    }
}

module.exports = ProductoServicio;