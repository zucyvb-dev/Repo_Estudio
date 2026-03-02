/**Maneja el repositorio del modelo de Cliente */
//Exportamos los modelos propio y de sus clases repositorio hijas
const Cliente = require('../modelos/Cliente');

class ClienteRepositorio {
    constructor(clienteInicial =  []) {
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
        const clienteNuevo = new Cliente(
            clienteDatos.id,
            clienteDatos.nombre,
            clienteDatos.activo,
            clienteDatos.contacto,
            clienteDatos.historial
        );

        this.cliente.push(clienteNuevo)
    
        return clienteNuevo;
    }

    //Eliminar un cliente
    eliminarCliente(clienteId){
        this.cliente.filter(c => c.id !== clienteId)
    }
}

module.exports = ClienteRepositorio;
