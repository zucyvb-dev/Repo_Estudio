/**Maneja la lógica del negocio de las Ventas y de su clase hija Items */
const Venta = require('../modelos/Venta');
const Validador = require('../utiles/Validador');

class VentaServicio {
    constructor(ventaRepositorio,clienteRepositorio,productoRepositorio,configRepositorio) {
        this.ventaRepo = ventaRepositorio;
        this.clienteRepo = clienteRepositorio;
        this.productoRepo = productoRepositorio;
        this.configRepo = configRepositorio;
    }

    //Registrar un venta
    registrarVenta(clienteId,items) {
        //Validar el cliente
        const cliente = this.clienteRepo.buscarClientePorId(clienteId);
        Validador.validarClienteActivo(cliente);

        //Validar Items
        items.forEach(item => {
            Validador.validarPrecioVentaProducto(item.precioUnitario);
            const producto = this.productoRepo.buscarPorId(item.productoId);
            Validador.validarStock(producto,item.cantidad);
        });

        //Calcular subtotal
        const subtotal = items.reduce(
            (acc,i) => acc + i.cantidad * i.precioUnitario,
            0
        );
    
        //Obtener configuración activa (tax, moneda)
        const config = this.configRepo.mostrarTodo()[0]; //primera activa
        const tax = subtotal * config.TAX;
        const total = subtotal + tax;

        //Generar el ID y la fecha
        const idVenta = this.ventaRepo.generarIdVenta();
        const fechaISO = new Date().toISOString().split("T")[0];

        //Crear el objeto venta
        const nuevaVenta = new Venta(idVenta,clienteId,items,subtotal,tax,total,fechaISO);

        //Insertar el repositorio    
        return this.ventaRepo.insertarVenta(nuevaVenta);
    }

    //Buscar ventas por Cliente
}