/**Maneja todos los reportes y listado de clientes */
const Validador = require('../utiles/Validador');

class ClienteReporte {
    constructor(clienteRepositorio,ventaRepositorio,rentaRepositorio) {
        this.clienteRepo = clienteRepositorio;
        this.ventaRepo = ventaRepositorio;
        this.rentaRepo = rentaRepositorio;  
    }

    //Listar todos los cliente
    listarClientes() {
        const clientes = this.clienteRepo.mostrarTodo();
        console.log("\n=== TODOS LOS CLIENTES ===");
        clientes.forEach(c => {
            console.log(`ID: ${c.id} | Nombre: ${c.nombre} | Email: ${c.contacto.email} | Teléfono: ${c.contacto.telefono} | Activo: ${c.activo}`);            
        });
    }

    //Listar todos los clientes activos
    listarClientesActivos() {
        const clientes = this.clienteRepo.mostrarTodo().filter(c => Validador.validarClienteActivo(c));
        console.log("\n=== CLIENTES ACTIVOS ===");
        clientes.forEach(c => {
            console.log(`ID: ${c.id} | Nombre: ${c.nombre} | Email: ${c.contacto.email} | Teléfono: ${c.contacto.telefono}`);            
        });
    }

    //Listar ventas realizadas por un cliente
    listarVentasPorCliente(clienteId) {
        return this.ventaRepo.buscarVentaPorCliente(clienteId);
    }

    //Listar rentas realizadas por un cliente
    listarRentasPorCliente(clienteId) {
        return this.rentaRepo.buscarRentaPorCliente(clienteId);
    }

    //Listar rentas devueltas por un cliente
    listarRentasDevueltasPorCliente(clienteId) {
        return this.rentaRepo.buscarRentaPorCliente(clienteId)
            .filter(r => r.devuelta);
    }

    //Total gastado en ventas por cliente
    totalGastadoVentas(clienteId) {
        return this.ventaRepo.buscarVentaPorCliente(clienteId)
            .reduce((acc, v) => acc + v.total, 0);
    }
    
    //Total gastado en rentas por cliente(solo si existe el repositorio de rentas)
    totalGastadoRentas(clienteId) {
        if (!this.rentaRepo) return 0;  //Validación eventual hasta que se implemente
        return this.rentaRepo.buscarRentaPorCliente(clienteId)
            .reduce((acc, v) => acc + v.total, 0);
    }

    //Cantidad de operaciones realizadas por cliente de (ventas + rentas)
    cantidadOperaciones(clienteId) {
        const venta = this.ventaRepo.buscarVentaPorCliente(clienteId);
        const renta = this.rentaRepo.buscarRentaPorCliente(clienteId);
        return venta + renta;
    }

    //Listado de IDs de ventas y rentas del historial del cliente
    historialOperaciones(clienteId) {
        const ventasIds = this.ventaRepo.buscarVentaPorCliente(clienteId).map(v => v.id);
        const rentaIds = this.rentaRepo ? this.rentaRepo.buscarRentaPorCliente(clienteId).map(r => r.id) : [];
        return {ventas: ventasIds, rentas: rentaIds};
    }

    //Reporte completo por cliente
    generarReporteCliente(clienteId) {
        return {
            clienteId,
            ventas: this.listarVentasPorCliente(clienteId).length,
            rentas: this.listarRentasPorCliente(clienteId).length,
            devueltas: this.listarRentasDevueltasPorCliente(clienteId).length,
            totalVentas: this.totalGastadoVentas(clienteId),
            totalRentas: this.totalGastadoRentas(clienteId),
            operaciones: this.cantidadOperaciones(clienteId),
            historial: this.historialOperaciones(clienteId)
        };
    }
}

module.exports = ClienteReporte;