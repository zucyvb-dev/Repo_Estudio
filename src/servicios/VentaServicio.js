/**Maneja la lógica del negocio de las Ventas y de su clase hija Items */
const VentaFabrica = require('../fabricas/VentaFabrica');
const Validador = require('../utiles/Validador');

class VentaServicio {
    constructor(ventaRepositorio,clienteRepositorio,productoRepositorio,configRepositorio, notificador) {
        this.ventaRepo = ventaRepositorio;
        this.clienteRepo = clienteRepositorio;
        this.productoRepo = productoRepositorio;
        this.configRepo = configRepositorio;
        this.notificador = notificador;
    }

    //Registrar un venta
    async registrarVenta(clienteId,items) {
        //Validar el cliente
        const cliente = await this.clienteRepo.buscarClientePorId(clienteId);
        Validador.validarClienteActivo(cliente);

        //Validar Items
        for (const item of items) {
            Validador.validarPrecioVentaProducto(item.precioUnitario);
            const producto = await this.productoRepo.buscarPorId(item.productoId);
            Validador.validarStock(producto, item.cantidad);
        };

        //Calcular subtotal
        const subtotal = items.reduce(
            (acc,i) => acc + i.cantidad * i.precioUnitario,
            0
        );
    
        //Obtener configuración activa (tax, moneda)
        const configs = this.configRepo.mostrarTodo();
        if (!configs || configs.length === 0) {
            throw new Error("No hay configuración activa (TAX, moneda, etc.)");
        }
        const config = configs[0];
        const taxRate = config.TAX ?? config.tax ?? 0;
        const tax = subtotal * taxRate;
        const total = subtotal + tax;

        //Generar el ID y la fecha
        const idVenta = await this.ventaRepo.generarIdVenta();
        const fechaISO = new Date().toISOString().split("T")[0];

        //Crear el objeto venta
        const nuevaVenta = VentaFabrica.crearVenta(idVenta,clienteId,items,subtotal,tax,total,fechaISO);

        //Insertar el repositorio   
        await this.ventaRepo.insertarVenta(nuevaVenta);

        // Notificar a los observadores
        await this.notificador.notificar("VENTA_REGISTRADA", nuevaVenta);
        
        //Devolver el objeto venta
        return nuevaVenta;
    }
}

module.exports = VentaServicio;