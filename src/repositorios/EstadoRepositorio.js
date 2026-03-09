/**Maneja el repositorio del Modelo Estado del producto */
const Estado = require('../modelos/Estado');

class EstadoRepositorio {
    constructor(estadosIniciales =[]) {
        this.estado = estadosIniciales.map(e => new Estado(e.rentado, e.clienteId))
    }
    
    //Mostrar todos los elementos de las tablas
    mostrarTodo(){
        return this.estado;
    }

    //Insertar un nuevo estado del Producto
    insertarEstado(estado) {
        this.estado.push(estado);
    }

    //Actualizar el estado del Producto
    actualizarEstado(index,rentado,clienteId) {
        if (!this.estado[index]) throw new Error ('Estado no encontrado');
        this.estado[index].actualizarEstado(rentado,clienteId);
            
        return this.estado[index];
    }
}