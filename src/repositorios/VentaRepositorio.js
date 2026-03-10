/**Maneja el repositorio del modelo de Ventas */
const Venta = require('../modelos/Venta');
const Item = require('../modelos/Item');

class VentaRepositorio {
    constructor(ventaIniciales = [], itemRepositorio) {
        this.itemRepo = itemRepositorio;
        this.ventas = ventaIniciales.map(v =>
            new Venta(
                v.id,
                v.clienteId,
                v.items.map(i => new Item(i.productoId,i.cantidad,i.precioUnitario)), //instaciación directa de ítems
                v.subtotal,
                v.tax,
                v.total,
                v.fechaISO
            )
        );
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

    
    //Mostrar todos los elementos de los Items
    mostrarTodo(){
        return this.ventas;
    }

    //Buscar por una Venta por Cliente
    buscarVentaPorCliente(clienteId) {
        return this.ventas.filter(v => v.clienteId === clienteId);
    }

    //Buscar una venta por fecha
    buscarVentaPorFecha(fecha) {
        return this.ventas.filter(v => v.fechaISO === fecha);
    }
}

module.exports = VentaRepositorio;