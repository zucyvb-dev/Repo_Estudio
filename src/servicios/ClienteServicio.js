/**Maneja la lágica del negocio de Cliente y sus clases hijas contacto e historial */
const ClienteFabrica = require('../fabricas/ClienteFabrica');
const Validador = require('../utiles/Validador');

class ClienteServicio {
    constructor(clienteRepositorio,productoServicio,ventaServicio, notificador) {
        this.clienteRepo = clienteRepositorio;
        this.productoServ = productoServicio;
        this.ventaServ = ventaServicio;
        this.notificador = notificador;
    }

    //Registrar un nuevo cliente
    insertarNuevoCliente(clientedatos) {
        //Validaciones de los datos del Cliente
        if (!Validador.validarClienteActivo(clientedatos)) throw new Error ('Cliente inválido o inactivo');

        //Valida los atributos de Cliente
        Validador.validarTextoNoVacio(clientedatos.nombre,"nombre");
        Validador.validarTextoNoVacio(clientedatos.contacto.email,"email");
        if (!Validador.validarEmail(clientedatos.contacto.email)) throw new Error ('Email inválido');
        Validador.validarTextoNoVacio(clientedatos.contacto.telefono,"telefono");
        if (!Validador.validarTelefono(clientedatos.contacto.telefono)) throw new Error ('Teléfono inválido');

        //Genero el IDs
        const nuevoId = this.clienteRepo.generarIdCliente();

        //Crear la instancia Cliente
        const nuevoCliente = ClienteFabrica.crearCliente(
            nuevoId,                     //Autoincremental
            {
                nombre: clientedatos.nombre,
                activo: clientedatos.activo,
                contacto: clientedatos.contacto,
                historial: { ventas: [], rentas: [] }
            }
        );

        //Notificar la inserción de nuevo cliente a los observadores
        this.notificador.notificar("CLIENTE_INSERTADO", nuevoCliente);

        const clienteInsertado = this.clienteRepo.insertarCliente(nuevoCliente);

        return clienteInsertado;
    }

    //Registrar una venta en el Historial de un Cliente
    insertarVentaPorCliente(clienteId,items) {
        const cliente = this.clienteRepo.buscarClientePorId(clienteId);
        Validador.validarObjetoExistente(cliente,"cliente");
        if (!Validador.validarClienteActivo(cliente)) throw new Error ('Cliente inválido o inactivo');
        Validador.validarObjetoExistente(items,"items");
        
        //Insertamos la venta correspondiente y me devuelve el objeto
        const venta = this.ventaServ.registrarVenta(clienteId, Array.isArray(items) ? items : [items]);
        if (!Validador.validarVenta(venta)) throw new Error ('Venta inválida');
    
        //Agregamos el historial de la venta del cliente
        this.clienteRepo.guardarHistorialCliente(clienteId,"venta",venta);

        //Notificar la inserción de una nueva venta del cliente a los observadores
        this.notificador.notificar("CLIENTE_VENTA_INSERTADA", {cliente, venta});

        return `Se insertó satisfactoriamente la venta del cliente: ${cliente.nombre}`;
    }

    //Registrar una renta en el Historial de un Cliente
    insertarRentaPorCliente(clienteId,renta) {
        const cliente = this.clienteRepo.buscarClientePorId(clienteId);
        if (!cliente) {
            throw new Error("El cliente es inválido o no existe");            
        }
        Validador.validarObjetoExistente(cliente,"cliente");
        if (!Validador.validarClienteActivo(cliente)) throw new Error ('Cliente inválido o inactivo');
        Validador.validarObjetoExistente(renta,"renta");
        
        //Insertamos la renta del producto correspondiente
        this.productoServ.registrarRentaProducto(renta);

        //Insertamos el historial
        this.clienteRepo.guardarHistorialCliente(clienteId,"renta",renta);
                
        //Notificar la inserción de una nueva renta del cliente a los observadores
        this.notificador.notificar("CLIENTE_RENTA_INSERTADA", {cliente, renta});

        return `del cliente: ${cliente.nombre}`;
    }
 
    //Realizar una devolución una renta de un cliente
    devolverProductoPorCliente(clienteId,idProducto) {
        const cliente = this.clienteRepo.buscarClientePorId(clienteId);
        Validador.validarObjetoExistente(cliente,"cliente");
        if (!Validador.validarClienteActivo(cliente)) throw new Error ('Cliente inválido o inactivo');
        
        //Insertamos la renta del producto correspondiente
        this.productoServ.devolverProducto(clienteId,idProducto);

        //Notificar la inserción de una nueva renta del cliente a los observadores
        this.notificador.notificar("CLIENTE_RENTA_DEVUELTA", {cliente, idProducto});

        //El historial ya tiene la renta, solo queda marcado en el producto y en la renta como devuelta en true
        return { 
            Por: ` el cliente: ${cliente.nombre}. `,
            Producto: idProducto};
    }

    //Consultar el historial completo de un cliente
    obtenerHistorialPorCliente(clienteId) {
        return this.clienteRepo.buscarHistorialPorCliente(clienteId);
    }

    //Consultar las ventas de un Cliente
    obtenerVentasPorCliente(clienteId) {
        const historial = this.clienteRepo.obtenerHistorialPorCliente(clienteId);   
        return historial && Array.isArray(historial.ventas) ? historial.ventas : [];
    }
    
    //Consultar las rentas de un Cliente
    obtenerRentasPorCliente(clienteId) {
        const historial = this.clienteRepo.obtenerHistorialPorCliente(clienteId);        
        return historial && Array.isArray(historial.rentas) ? historial.rentas : [];
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

        // Notificar actualización de los datos del Cliente
        this.notificador.notificar("CLIENTE_ACTUALIZADO", cliente);

        return 'Se actualizó satisfactoriamente';
    }
    
    //Actualizar el teléfono de un cliente
    actualizarTelefonoCliente(clienteId,nuevoTelefono) {
        const cliente = this.clienteRepo.buscarClientePorId(clienteId);
        if (!Validador.validarClienteActivo(cliente)) throw new Error ('Cliente inválido o inactivo');
        if (!Validador.validarTelefono(nuevoTelefono)) throw new Error ('Teléfono inválido');

        if (cliente) cliente.contacto.actualizarTelefono(nuevoTelefono);
        
        // Notificar actualización de los datos del Cliente
        this.notificador.notificar("CLIENTE_ACTUALIZADO", cliente);

        return 'Se actualizó satisfactoriamente';
    }
}

module.exports = ClienteServicio;