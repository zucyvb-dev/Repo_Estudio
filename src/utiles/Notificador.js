/**Maneja al sujeto que notifica a todos los observadores sobre los cambios */

class Notificador {
    constructor() {
        this.observadores = [];
    }

    // Suscribir un observador
    suscribir(observador) {
        this.observadores.push(observador);
    }

    // Desuscribir un observador
    desuscribir(observador) {
        this.observadores = this.observadores.filter(obs => obs !== observador);
    }

    // Notificar a todos los observadores
    async notificar(evento, data) {
        const tareas = this.observadores
            .filter(obs => typeof obs.actualizar === "function")
            .map(obs => obs.actualizar(evento, data));

        //Todos los observadores se ejecutan en paralelo y notificar espera a que todos terminen
        await Promise.all(tareas);
    }
}

module.exports = Notificador;
