/**Maneja el repositorio del Modelo del Historial */
//Exporto el modelo de Historial
const Historial = require('../modelos/Historial');

class HistorialRepositorio {
    constructor(historialInicial = []) {
        this.historial = Array.isArray(historialInicial)
        ? historialInicial.map(h => ({
            ventas: Array.isArray(h && h.ventas) ? h.ventas : [],
            rentas: Array.isArray(h && h.rentas) ? h.rentas : []
            }))
        : [];
    }
   
    //Mostrar todos los elementos del Historial
    mostrarTodo() {
        return this.historial;
    }

    //Buscar por indice (pasar la posicion en el array de cliente)
    mostrarPorIndice(indice){
        return this.historial[indice];
    }

    //Buscar todas las ventas de un historial especifico
    mostrarHistoriaVentas(historial) {
        return historial.ventas;
    }

    //Buscar todas las rentas de un historial especifico
    mostrarHistoriaRentas(historial) {
        return historial.rentas;
    }

    //Insertar un historial completo
    insertarHistorial(historial) {
        if (!(Historial instanceof Historial)) {
            throw new Error("Objeto no válido, debe ser un historial");            
        } else {
            this.historial.push(historial);
        }
    }
}

module.exports = HistorialRepositorio;