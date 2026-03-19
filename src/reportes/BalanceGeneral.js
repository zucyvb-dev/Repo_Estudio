/**Balance General de la gestión de clientes, productos ventas y rentas */

class BalanceGeneral {
    constructor(clienteRepositorio,productoRepositorio,ventaRepositorio,rentaRepositorio) {
        this.clienteRepo = clienteRepositorio;
        this.productoRepo = productoRepositorio;
        this.ventaRepo = ventaRepositorio;
        this.rentaRepo = rentaRepositorio;
    }

    //Configurar el Balance General como Observador
    actualizar(evento, data) {
        if (evento === "VENTA_REGISTRADA" || evento === "RENTA_REGISTRADA") {
            console.log("BalanceGeneral: recalculando balance...");
            console.log(this.generarBalanceGeneral());
        }
    }

    //Balance general
    generarBalanceGeneral() {
        //1. Total de ingresos por venta
        const ingresosVentas = this.ventaRepo.mostrarTodo()
            .reduce((acc, v) => acc + (v.costo || 0), 0);

        //2. Total de ingresos por renta
        const ingresosRentas = this.rentaRepo.mostrarTodo()
            .reduce((acc, r) => acc + (r.costo || 0), 0);

         //3. Total general de ventas + rentas
        const totalGeneral = ingresosVentas + ingresosRentas;

        //4. Cliente que más gastó
        const clientes = this.clienteRepo.mostrarTodo();
        const clienteMasGasto = clientes.map(c => {
            const gastoVentas = (c.historial.ventas || []).reduce((acc, v) => acc + (v.costo || 0), 0);
            const gastoRentas = (c.historial.rentas || []).reduce((acc, r) => acc + (r.costo || 0), 0);
            return {id: c.id, nombre: c.nombre, gastoTotal: gastoVentas + gastoRentas };
        }).sort((a, b) => b.gastoTotal - a.gastoTotal)[0];

        //5. % productos almacenados (stock > 0)
        const productos = this.productoRepo.mostrarTodo();
        const totalProductos = productos.length;
        const productosConStock = productos.filter(p => p.stock > 0).length;
        const porcentajeAlmacenado = totalProductos === 0 ? 0 : Math.round((productosConStock / totalProductos) * 100);

        return {
            ingresosVentas,
            ingresosRentas,
            totalGeneral,
            clienteMasGasto,
            porcentajeProductosAlmacenados: porcentajeAlmacenado
        };
    }
}

module.exports = BalanceGeneral;