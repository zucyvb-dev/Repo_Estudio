/**Maneja la lágica del negocio de Cliente y sus clases hijas contacto e historial */
const Cliente = require('../modelos/Cliente');
const Validador = require('../utiles/Validador');

class ClienteServicio {
    constructor(clienteRepositorio) {
        this.clienteRepo = clienteRepositorio;
    }

    //Mostrar todos los clientes activos
    listarClientesActivos() {
        return this.clienteRepo.mostrarTodo().filter(c => Validador.validarClienteActivo(c));
    }

    //Registrar un nuevo cliente
    insertarNuevoCliente(clientedatos) {
        if (!Validador.validarClienteActivo(clientedatos.activo)) throw new Error ('Cliente inválido o inactivo');
        if (!Validador.validarEmail(clientedatos.contacto.email)) throw new Error ('Email inválido');
        if (!Validador.validarTelefono(clientedatos.contacto.telefono)) throw new Error ('Teléfono inválido');

        //Crear la instancia Cliente
        const nuevoCliente = new Cliente(
            clientedatos.id,
            clientedatos.nombre,
            clientedatos.activo,
            clientedatos.contacto
        );

        return this.clienteRepo.insertarCliente(nuevoCliente);
    }

    //Registrar una venta en el Historial de un Cliente
    insertarVentaPorCliente(clienteId,venta) {
        const cliente = this.clienteRepo.buscarClientePorId(clienteId);
        if (!Validador.validarClienteActivo(cliente)) throw new Error ('Cliente inválido o inactivo');
        if (!Validador.validarVenta(venta)) throw new Error ('Venta inválida');
    
        cliente.registrarVenta(venta);
        this.clienteRepo.guardarHistorialCliente(clienteId,"venta",venta);
        return `Se insertó satisfactoriamente la venta del cliente: ${cliente.nombre}`;
    }

    //Registrar una renta en el Historial de un Cliente
    insertarRentaPorCliente(clienteId,renta) {
        const cliente = this.clienteRepo.buscarClientePorId(clienteId);
        if (!Validador.validarClienteActivo(cliente)) throw new Error ('Cliente inválido o inactivo');
        if (!Validador.validarRenta(renta)) throw new Error ('Renta inválida');
    
        cliente.registrarRenta(renta);
        this.clienteRepo.guardarHistorialCliente(clienteId,"renta",renta);
        return `Se insertó satisfactoriamente la renta del cliente: ${cliente.nombre}`;
    }

    //Consultar el historial completo de un cliente
    obtenerHistorialPorCliente(clienteId) {
        return this.clienteRepo.buscarHistorialPorCliente(clienteId);
    }

    //Consultar las ventas de un Cliente
    obtenerVentasPorCliente(clienteId) {
        const historial = this.clienteRepo.obtenerHistorialPorCliente(clienteId);        
        return historial ? historial.ventas : [];
    }
    
    //Consultar las rentas de un Cliente
    obtenerRentasPorCliente(clienteId) {
        const historial = this.clienteRepo.obtenerHistorialPorCliente(clienteId);        
        return historial ? historial.rentas : [];
    }

    //Verificar si un cliente tiene una venta
    tieneClienteVenta(clienteId,ventaId) {
        const cliente = this.clienteRepo.buscarClientePorId(clienteId);
        
        if (!Validador.validarClienteActivo(cliente)) throw new Error ('Cliente inválido o inactivo');
        if (!cliente.historial || cliente.historial.length === 0) return false;  //No tiene ventas registradas
        
        return this.clienteRepo.buscarHVentasCliente(clienteId,ventaId);
    }
    
    //Verificar si un cliente tiene una renta
    tieneClienteRenta(clienteId,rentaId) {
        const cliente = this.clienteRepo.buscarClientePorId(clienteId);
        
        if (!Validador.validarClienteActivo(cliente)) throw new Error ('Cliente inválido o inactivo');
        if (!cliente.historial || cliente.historial.length === 0) return false; //No tiene rentas registradas
        
        return this.clienteRepo.buscarHRentasCliente(clienteId,rentaId);
    }

    //Actualizar el email de un cliente
    actualizarEmailCliente(clienteId,nuevoEmail) {
        const cliente = this.clienteRepo.buscarClientePorId(clienteId);
        if (!Validador.validarClienteActivo(cliente)) throw new Error ('Cliente inválido o inactivo');
        if (!Validador.validarEmail(nuevoEmail)) throw new Error ('Email inválido');

        if (cliente) cliente.contacto.actualizarEmail(nuevoEmail);
        return 'Se actualizó satisfactoriamente';
    }
    
    //Actualizar el teléfono de un cliente
    actualizarTelefonoCliente(clienteId,nuevoTelefono) {
        const cliente = this.clienteRepo.buscarClientePorId(clienteId);
        if (!Validador.validarClienteActivo(cliente)) throw new Error ('Cliente inválido o inactivo');
        if (!Validador.validarTelefono(nuevoTelefono)) throw new Error ('Teléfono inválido');

        if (cliente) cliente.contacto.actualizarTelefono(nuevoTelefono);
        return 'Se actualizó satisfactoriamente';
    }
}

module.exports = ClienteServicio;