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
}

module.exports = Historial;