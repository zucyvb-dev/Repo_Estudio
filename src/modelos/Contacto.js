/**Manejo del modelo de los contactos como clase auxiliar de Clientes */

class Contacto {
    constructor(email,telefono) {
        this.email = email;
        this.telefono = telefono;
    }

    //Actualizar Email
    actualizarEmail(nuevoEmail) {
        this.email = nuevoEmail;
    }

    //Actualizar Telefono
    actualizarTelefono(nuevoTelefono) {
        this.telefono = nuevoTelefono;
    }
}

module.exports = Contacto;