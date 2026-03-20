/**Maneja el repositorio del modelo de Cliente */
//Exportamos los modelos propio y de sus clases repositorio hijas
const ClienteFabrica = require('../fabricas/ClienteFabrica');

class ClienteRepositorio {
    constructor(clienteInicial =  [], contactoRepo, historialRepo) {
        this.cliente = clienteInicial.map(c => ClienteFabrica.crearCliente(c.id, c));
        this.contactoRepo = contactoRepo;
        this.historialRepo = historialRepo;        
    }

    //Mostrar todos los clientes
    mostrarTodo() {
        return this.cliente;
    }

    //Buscar cliente por Id
    async buscarClientePorId(clienteId) {
        return this.cliente.find(c => c.id === clienteId);
    }

    //Generar el ID
    generarIdCliente() {
        if (this.cliente.length === 0) return "C001";
        const ultimoId = this.cliente[this.cliente.length - 1].id;
        const numero = parseInt(ultimoId.substring(1));
        const nuevoNumero = numero + 1;
        return "C" + nuevoNumero.toString().padStart(3, "0");
    }

    //Agregar un nuevo cliente
    async insertarCliente(clienteNuevo) {        
       
        // Asegurar estructura de historial en el cliente nuevo
        clienteNuevo.historial = clienteNuevo.historial && typeof clienteNuevo.historial === 'object'
            ? {
                ventas: Array.isArray(clienteNuevo.historial.ventas) ? clienteNuevo.historial.ventas : [],
                rentas: Array.isArray(clienteNuevo.historial.rentas) ? clienteNuevo.historial.rentas : []
            }
            : { ventas: [], rentas: [] };

        this.cliente.push(clienteNuevo);    
        return clienteNuevo;
    }

    //Eliminar un cliente
    async eliminarCliente(clienteId){
        this.cliente = this.cliente.filter(c => c.id !== clienteId);
    }

    //Buscar por Email
    async buscarPorEmail(email) {
        return this.cliente.find(c => c.contacto.email === email) || null;
    }

    //Buscar por telefono
    async buscarPorTelefono(telefono) {
        return this.cliente.find(c => c.contacto.telefono === telefono) || null;
    }
    
    //Buscar si un cliente tiene una venta especifica
    async buscarHVentasCliente(clienteId,ventasId) {
        const cliente = await this.buscarClientePorId(clienteId)
        return cliente ? cliente.historial.ventas.includes(ventasId) : false;
    }

    //Buscar si un cliente tiene una renta especifica
    async buscarHRentasCliente(clienteId,rentaId) {
        const cliente = await this.buscarClientePorId(clienteId)
        return cliente ? cliente.historial.rentas.includes(rentaId) : false;
    }

    //Buscar historial por Cliente
    async buscarHistorialPorCliente(clienteId) {
        const historiaCliente = this.historialRepo.find(h => h.clienteId === clienteId);;        
        return historiaCliente ? historiaCliente.historial : null;
    }

    //Guardar el historial de un Cliente
    async guardarHistorialCliente(clienteId,tipo,elemento) {
        const cliente = await this.buscarClientePorId(clienteId);
        if (!cliente) throw new Error("Cliente no encontrado");
        
        if (!cliente.historial || typeof cliente.historial !== 'object') {
            cliente.historial = { ventas: [], rentas: [] };
        }

        if (tipo === 'venta') {
            cliente.historial.ventas = Array.isArray(cliente.historial.ventas) ? cliente.historial.ventas : [];
            cliente.historial.ventas.push(elemento);
        } else if (tipo === 'renta') {
            cliente.historial.rentas = Array.isArray(cliente.historial.rentas) ? cliente.historial.rentas : [];
            cliente.historial.rentas.push(elemento);
        }
       
        return cliente.historial;
    }
}

module.exports = ClienteRepositorio;
