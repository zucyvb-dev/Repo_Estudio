/**Maneja todos los reportes y listados de las Rentas */

class RentaReporte {
    constructor(rentaRepositorio) {
        this.rentaRepo = rentaRepositorio;
    }

    //Listar todas las Rentas
    listarRentas() {
        return this.rentaRepo.mostrarTodo()
            .map(r => ({
                id: r.id,
                clienteId: r.clienteId,
                productoId: r.productoId,
                modelo: r.modelo,
                dias: r.dias,
                costo: r.costo,
                fechaISO: r.fechaISO,
                devuelta: r.devuelta ? "Sí" : "No"
        }));
    }

    //Listar todas las rentas activas
    listarRentasActivas() {
        return this.rentaRepo.mostrarTodo()
            .filter(r => !r.devuelta)
            .map(r => ({
                id: r.id,
                clienteId: r.clienteId,
                productoId: r.productoId,
                modelo: r.modelo,
                dias: r.dias,
                costo: r.costo,
                fechaISO: r.fechaISO
        }));
    }

    //Listar rentas por fecha
    listarRentasPorFecha(fecha) {
        return this.rentaRepo.buscarRentaPorFecha(fecha)
            .map(r => ({
            id: r.id,
            clienteId: r.clienteId,
            productoId: r.productoId,
            modelo: r.modelo,
            dias: r.dias,
            costo: r.costo,
            devuelta: r.devuelta ? "Sí" : "No"
        }));
    }

    //Listar rentas por Periodo
    listarRentasPorPeriodo(fechaIni,fechaFin) {
        return this.rentaRepo.mostrarTodo()
            .filter(r => r.fechaISO >= fechaIni && r.fechaISO <= fechaFin)
            .map(r => ({
                id: r.id,
                clienteId: r.clienteId,
                productoId: r.productoId,
                modelo: r.modelo,
                dias: r.dias,
                costo: r.costo,
                fechaISO: r.fechaISO,
                devuelta: r.devuelta ? "Sí" : "No"
        }));
    }

    //Total de rentas registradas
    totalRentas() {
        return this.rentaRepo.mostrarTodo().length;
    }

    //Total de ingresos por rentas
    ingresosPorRentas() {
        return this.rentaRepo.mostrarTodo()
            .reduce((acc, r) => acc + r.costo, 0);
    }

    //Balance general de las rentas
    generarReporteGeneralRentas() {
        const rentas = this.rentaRepo.mostrarTodo();
        const activas = rentas.filter(r => !r.devuelta).length;
        const devueltas = rentas.filter(r => r.devuelta).length;
        const ingresosTotales = this.ingresosPorRentas();

        return {
            totalRentas: this.totalRentas(),
            activas,
            devueltas,
            ingresosTotales
        };
    }
}

module.exports = RentaReporte;