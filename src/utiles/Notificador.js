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
    notificar(evento, data) {
        this.observadores.forEach(obs => {
            if (typeof obs.actualizar === "function") {
                obs.actualizar(evento, data);
            }
        });
    }
}

module.exports = Notificador;
