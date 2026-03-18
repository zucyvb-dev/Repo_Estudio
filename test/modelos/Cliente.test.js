/**Maneja el test unitario del Modelo de Cliente y sus clases hijas Contacto e Historial */
const Cliente = require('../../src/modelos/Cliente');
const Contacto = require('../../src/modelos/Contacto');
const Historial = require('../../src/modelos/Historial');

describe('Cliente', () => {
  
    // Caso base: inicialización con objetos válidos
    test('inicializa correctamente con Contacto y Historial válidos', () => {
        const contacto = new Contacto('rosy@example.com', '555-1234');
        const historial = new Historial([], []);
        const c = new Cliente('C001', 'Rosy', true, contacto, historial);

        expect(c.id).toBe('C001');
        expect(c.nombre).toBe('Rosy');
        expect(c.activo).toBe(true);
        expect(c.contacto).toBeInstanceOf(Contacto);
        expect(c.historial).toBeInstanceOf(Historial);
    });

    // Caso: activo coercionado a booleano
    test('convierte activo a booleano', () => {
        const cTruthy = new Cliente('C002', 'Ana', 'yes', {}, {});
        const cFalsy = new Cliente('C003', 'Luis', 0, {}, {});
        expect(cTruthy.activo).toBe(true);
        expect(cFalsy.activo).toBe(false);
    });

    // Caso: contacto como objeto literal
    test('inicializa contacto desde literal', () => {
        const contactoLiteral = { email: 'ana@example.com', telefono: '555-5678' };
        const c = new Cliente('C004', 'Ana', true, contactoLiteral, {});
        expect(c.contacto).toBeInstanceOf(Contacto);
        expect(c.contacto.email).toBe('ana@example.com');
        expect(c.contacto.telefono).toBe('555-5678');
    });

    // Caso: contacto como null
    test('inicializa contacto queda null si se pasa null', () => {
        const c = new Cliente('C005', 'Ana', true, {}, {});
        expect(c.contacto).toBeNull();
    });

    // Caso: historial como objeto literal
    test('inicializa historial desde literal', () => {
        const historialLiteral = { ventas: ['V001'], rentas: ['R001'] };
        const c = new Cliente('C006', 'Pedro', true, {}, historialLiteral);
        expect(c.historial).toBeInstanceOf(Historial);
        expect(c.historial.ventas).toContain('V001');
        expect(c.historial.rentas).toContain('R001');
    });

    // Caso: historial como null
    test('inicializa historial queda null si se pasa null', () => {
        const c = new Cliente('C006', 'Pedro', true, {}, {});
        expect(c.historial).toBeNull();
    });

    // Caso: historial de Ventas como objeto literal
    test('registrarVenta inserta en historial', () => {
        const c = new Cliente('C007', 'Maria', true, {}, {});
        c.registrarVenta('V002');
        expect(c.historial.ventas).toContain('V002');
    });

    // Caso: historial de Renta como objeto literal
    test('registrarRenta inserta en historial', () => {
        const c = new Cliente('C008', 'Jose', true, {}, {});
        c.registrarRenta('R002');
        expect(c.historial.rentas).toContain('R002');
    });

});
