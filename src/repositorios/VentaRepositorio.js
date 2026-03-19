/**Maneja el repositorio del modelo de Ventas */
const VentaFabrica = require('../fabricas/VentaFabrica');

class VentaRepositorio {
    constructor(ventaIniciales = [], itemRepositorio) {
        // Si no es array, inicializa vacío
        if (!Array.isArray(ventaIniciales)) {
            this.ventas = [];
        } else {
            this.ventas = ventaIniciales.map(v => VentaFabrica.crearVenta(
                v.id,
                v.clienteId,
                v.items,
                v.subtotal,
                v.tax,
                v.total,
                v.fechaISO
            ));

        }

        this.itemRepo = itemRepositorio;
    }

    //Funciones auxiliares par IDs incrementales
    generarIdVenta() {
        if (this.ventas.length === 0) return "V001";
        const ultimoVId = this.ventas[this.ventas.length -1].id;
        const numeroV = parseInt(ultimoVId.substring(1));
        const numeroVNuevo = numeroV + 1;
        return "V" + numeroVNuevo.toString().padStart(3,"0");
    }

    //Insertar una Venta
    insertarVenta(venta) {
        //Validar el item con el repositorio hijo
        venta.items = venta.items.map(i => this.itemRepo.insertarItem(i));
        
        this.ventas.push(venta);
        return venta;
    }
    
    //Mostrar todos los elementos de las Ventas
    mostrarTodo(){
        return this.ventas;
    }

    //Buscar por una Venta por Cliente
    buscarVentaPorCliente(clienteId) {
        return this.ventas.filter(v => v.clienteId === clienteId);
    }
    
    //Buscar por una Venta por Producto
    buscarVentaPorProducto(idProducto) {
        return this.ventas.filter(v => v.items.some(i => i.productoId === idProducto));
    }

    //Buscar una venta por fecha
    buscarVentaPorFecha(fecha) {
        return this.ventas.filter(v => v.fechaISO === fecha);
    }

    //Buscar por id de Venta
    buscarPorIdVenta(idVenta) {
        return this.ventas.find(v => v.id === idVenta);
    }
}

module.exports = VentaRepositorio;