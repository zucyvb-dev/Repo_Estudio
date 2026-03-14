/**Maneja los reportes de las Ventas */

class VentaReportes {
    constructor(ventaRepositorio) {
        this.ventaRepo = ventaRepositorio;
    }

    //Mostrar todas las ventas por cliente
    ventasPorCliente(clienteId) {
        return this.ventaRepo.buscarVentaPorCliente(clienteId);
    }

    //Mostrar las ventas por fecha
    ventasPorFechaISO(fecha) {
        return this.ventaRepo.buscarVentaPorFecha(fecha);
    }

    //Mostrar el total de ventas
    totalVentas() {
        return this.ventaRepo.mostrarTodo()
            .reduce((acc,v) => acc + v.total,0);
    }

    //Mostrar el total de ventas en una fecha
    totalVentasPorFecha(fecha) {
        return this.ventaRepo.mostrarTodo().filter(v =>
            v.fechaISO >= fecha)
            .reduce((acc,v) => acc + v.total,0);
    }

    //Mostrar el total de ventas en un periodo
    totalVentasPeriodo(fechaInicio,fechaFin) {
        return this.ventaRepo.mostrarTodo().filter(v =>
            v.fechaISO >= fechaInicio && v.fechaISO <= fechaFin)
            .reduce((acc,v) => acc + v.total,0);
    }

    //Mostrar los productos mas vendidos
    productosMasVendidos() {
        const conteo = {};
        this.ventaRepo.mostrarTodo().forEach(v => {
            v.items.forEach(i => {
                conteo[i.productoId] = (conteo[i.productoId] || 0) + i.cantidad;
            });
        });
        return conteo;
    }
    
    //Total de ingresos por ventas
    ingresosPorVentas() {
        const ventas = this.ventaRepo.mostrarTodo() || [];
        return ventas.reduce((acc, v) => {
            const costo = Number(v?.costo);
            return acc + (Number.isFinite(costo) ? costo : 0);
        }, 0);
    }
    
    //Balance general de las ventas
    generarReporteGeneralVentas() {
        
        return {
            totalVentas: this.totalVentas(),
            productosMasVendidos: this.productosMasVendidos(),
            ingresosTotales: this.ingresosPorVentas()
        };
    }
}

module.exports = VentaReportes;