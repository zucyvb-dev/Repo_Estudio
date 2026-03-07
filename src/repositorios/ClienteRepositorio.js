/**Maneja el repositorio del modelo de Cliente */
//Exportamos los modelos propio y de sus clases repositorio hijas
const Cliente = require('../modelos/Cliente');

class ClienteRepositorio {
    constructor(contactoRepo,historialRepo,clienteInicial =  []) {
        this.contactoRepo = contactoRepo;
        this.historialRepo = historialRepo;
        this.cliente = clienteInicial.map(c => new Cliente(
            c.id,
            c.nombre,
            c.activo,
            c.contacto,
            c.historial
        ));
    }

    //Mostrar todos los clientes
    mostrarTodo() {
        return this.cliente;
    }

    //Buscar cliente por Id
    buscarClientePorId(clienteId) {
        return this.cliente.find(c => c.id === clienteId);
    }

    //Agregar un nuevo cliente
    insertarCliente(clienteDatos) {
        const existe = this.buscarClientePorId(clienteDatos.id);
        if (existe) {
            throw new Error("Ya existe ya existe ese cliente");            
        }

        this.cliente.push(clienteNuevo);    
        return clienteNuevo;
    }

    //Eliminar un cliente
    eliminarCliente(clienteId){
        this.cliente.filter(c => c.id !== clienteId)
    }

    //Buscar por Email
    buscarPorEmail(email) {
        return this.cliente.find(c => c.contacto.email === email) || null;
    }

    //Buscar por telefono
    buscarPorTelefono(telefono) {
        return this.cliente.find(c => c.contacto.telefono === telefono) || null;
    }
    
    //Buscar si un cliente tiene una venta especifica
    buscarHVentasCliente(clienteId,ventasId) {
        const cliente = this.buscarClientePorId(clienteId)
        return cliente ? historial.ventas.include(ventasId) : false;
    }

    //Buscar si un cliente tiene una renta especifica
    buscarHRentasCliente(clienteId,rentaId) {
        const cliente = this.buscarClientePorId(clienteId)
        return cliente ? historial.rentas.include(rentaId) : false;
    }

    //Buscar historial por Cliente
    buscarHistorialPorCliente(clienteId) {
        const historiaCliente = this.historial.find(h => h.clienteId === clienteId);        
        return historiaCliente ? historiaCliente.historial : null;
    }

    //Guardar el historial de un Cliente
    guardarHistorialCliente(clienteId,tipo,elemento) {
        const cliente = this.buscarClientePorId(clienteId);
        if (!cliente) return;
        
        if (tipo === "venta") {
            cliente.historial.ventas.push(elemento);
        } else if (tipo === "renta"){
            cliente.historial.rentas.push(elemento);
        }
        return cliente.historial;
    }
}

module.exports = ClienteRepositorio;
