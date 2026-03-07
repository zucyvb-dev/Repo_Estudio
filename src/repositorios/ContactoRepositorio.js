/**Maneja el modelo de los Contactos */
//Exporto el modelo de Contacto
const Contacto = require('../modelos/Contacto');

class ContactoRepositorio {
    constructor(contactoInicial = []) {
        this.contacto = contactoInicial.map(c => new Contacto(c.email,c.telefono));
    }

    //Mostrar todos los elementos de las tablas
    mostrarTodo(){
        return this.contacto;
    }

    //Buscar por email
    buscarPorEMail(email){
        return this.contacto(c => c.email === email) || null;
    }
    
    //Buscar por telefono
    buscarPorTelefono(telefono){
        return this.contacto(c => c.telefono === telefono) || null;
    }

}

module.exports = ContactoRepositorio;