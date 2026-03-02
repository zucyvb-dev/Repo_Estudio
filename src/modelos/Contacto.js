/**Manejo del modelo de los contactos como clase auxiliar de Clientes */

class Contacto {
    constructor(email,telefono) {
        this.email = email;
        this.telefono = telefono;
    }
}

module.exports = Contacto;