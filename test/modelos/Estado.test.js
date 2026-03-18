/**Maneja los test unitarios del modelo Estado del Producto */
const Estado = require('../../src/modelos/Estado');

describe('Estado', () => {
  
    // Caso base: inicialización con valores válidos
    test('inicializa correctamente con valores', () => {
        const e = new Estado(true, 'C001');
        expect(e.rentado).toBe(true);
        expect(e.clienteId).toBe('C001');
    });

    // Caso: inicialización por defecto
    test('inicializa con valores por defecto', () => {
        const e = new Estado();
        expect(e.rentado).toBe(false);
        expect(e.clienteId).toBeNull();
    });

    // Caso: clienteId nulo
    test('clienteId se mantiene en null si no se pasa', () => {
        const e = new Estado(true);
        expect(e.rentado).toBe(true);
        expect(e.clienteId).toBeNull();
    });

    // Caso: rentado se fuerza a booleano
    test('rentado siempre se guarda como booleano', () => {
        const eTruthy = new Estado('yes', 'C002'); // cualquier valor truthy
        const eFalsy = new Estado(0, 'C003');      // valor falsy
        expect(typeof eTruthy.rentado).toBe('boolean');
        expect(eTruthy.rentado).toBe(true);
        expect(eFalsy.rentado).toBe(false);
    });

    // Caso: actualizar estado del producto
    test('actualizarEstado cambia rentado y clienteId', () => {
        const e = new Estado(false, null);
        
        // Actualizo el estado
        e.actualizarEstado(true, 'C123');
        
        // Verifico que se hayan actualizado las propiedades
        expect(e.rentado).toBe(true);
        expect(e.clienteId).toBe('C123');
    });

    // Caso: actualizarEstado con valores falsy
    test('actualizarEstado maneja valores falsy', () => {
        const e = new Estado(true, 'C001');
        
        e.actualizarEstado(false, null);
        
        expect(e.rentado).toBe(false);
        expect(e.clienteId).toBeNull();
    });

});
