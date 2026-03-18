/**Maneja el test unitario del repositorio de Contacto */
const ContactoRepositorio = require('../../src/repositorios/ContactoRepositorio');
const Contacto = require('../../src/modelos/Contacto');

describe('ContactoRepositorio', () => {
  
    let repo;
    let contactoBase;

    beforeEach(() => {
        contactoBase = new Contacto('rosy@example.com', '555-1234');
        repo = new ContactoRepositorio([contactoBase]);
    });

    test('mostrarTodo devuelve todos los contactos', () => {
        const contactos = repo.mostrarTodo();
        expect(contactos).toHaveLength(1);
        expect(contactos[0].email).toBe('rosy@example.com');
    });

    test('buscarPorEMail devuelve el contacto correcto', () => {    
        const contacto = repo.buscarPorEMail('rosy@example.com');
        expect(contacto).toBeDefined();
        expect(contacto.telefono).toBe('555-1234');
    });

    test('buscarPorTelefono devuelve el contacto correcto', () => {
        const contacto = repo.buscarPorTelefono('555-1234');
        expect(contacto).toBeDefined();
        expect(contacto.email).toBe('rosy@example.com');
    });

    test('buscarPorEMail devuelve null si no existe', () => {
        const contacto = repo.buscarPorEMail('noexiste@example.com');
        expect(contacto).toBeNull();
    });

    test('buscarPorTelefono devuelve null si no existe', () => {
        const contacto = repo.buscarPorTelefono('000-0000');
        expect(contacto).toBeNull();
    });

});
