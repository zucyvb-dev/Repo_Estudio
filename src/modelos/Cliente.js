/**Manejo del Modelo de los clientes */
/**Deben requerirse dos modelos que dependen de clientes: contacto e historial */
const Contacto = require('./Contacto');
const Historial = require('./Historial');

class Cliente {
    constructor(id,nombre,activo,contacto,historial) {
        this.id = id;
        this.nombre = nombre;
        this.activo = activo;

        //Contacto y Historial son exclusivos de Clientes
        this.contacto = contacto instanceof Contacto
            ? contacto
            : new Contacto(contacto.email,contacto.telefono);

        this.historial = historial instanceof Historial
            ? historial
            :new Historial(historial.ventas || [],historial.rentas || []);        
    }
}

module.exports = Cliente;