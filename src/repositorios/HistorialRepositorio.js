/**Maneja el repositorio del Modelo del Historial */
//Exporto el modelo de Historial
const Historial = require('../modelos/Historial');

class HistorialRepositorio {
    constructor(historialInicial = []) {
        this.historial = historialInicial.map(h => ({
            historial: new Historial(h.ventas || [],h.rentas || [])
        }));  
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

    //Buscar si un cliente tiene una venta especifica
    buscarHVentasCliente(historial,ventasId) {
        return historial.ventas.include(ventasId);
    }

    //Buscar si un cliente tiene una renta especifica
    buscarHRentasCliente(historial,rentaId) {
        return historial.rentas.include(rentaId);
    }

    //Buscar historial por Cliente
    buscarPorCliente(clienteId) {
        const historiaCliente = this.historial.find(h => h.clienteId === clienteId);        
        return historiaCliente ? historiaCliente.historial : null;
    }

    //Guardar el historial de un Cliente
    guardarHistorialCliente(historial,clienteId) {
        const idx = this.historial.find(h => h.clienteId === clienteId);
        
        if (idx >= 0) {
            this.historial[idx].historial = historial;
        } else {
            this.historial.push({ clienteId, historial})
        }
        return "Se ha insertado el historial del cliente "+ clienteId;
    }
}

module.exports = HistorialRepositorio;