/**Maneja del modelo del Historial como clase auxiliar de los clientes */

class Historial {
    constructor(ventas = [], rentas = []) {
        this.ventas = ventas;
        this.rentas = rentas;
    }
    
    //Agregar una nueva venta
    insertarVentas(ventaId) {
        if (!ventaId) throw new Error("Venta Inválida");        
        return this.ventas.push(ventaId);
    }

    //Agregar una nueva Renta
    insertarRenta(rentaId) {
        if (!rentaId) throw new Error("Renta Inválida");    
        return this.rentas.push(rentaId);
    }

    //Conocer cuantas Ventas hay
    cantidadVentas() {
        return this.ventas.length;
    }

    //Conocer cuantas Rentas Hay
    cantidadRentas() {
        return this.rentas.length;
    }
    
    //Total de las Ventas
    totalVentas() {
        return this.ventas.reduce((suma, v) => suma + (v.total || 0), 0);
    }
    
    //Total de las Rentas
    totalRentas() {
        return this.rentas.reduce((suma, r) => suma + (r.costo || 0), 0);
    }

    //Total de operaciones
    operaciones() {
        return this.cantidadVentas() + this.cantidadRentas();
    }

    //Devolver todos los IDs de los productos utilizados por los clientes de las rentas y las ventas
    idsOperaciones() {
        return [
            ...this.ventas.map(v => v.productoId),
            ...this.rentas.map(r => r.productoId)
        ];
    }

}

module.exports = Historial;