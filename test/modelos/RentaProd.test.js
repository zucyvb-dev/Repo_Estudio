/**Maneja los test unitarios del modelo RentaProd de los Productos */
const RentaProd = require('../../src/modelos/RentaProd');

describe('RentaProd', () => { 
   
    // Caso base: inicialización con valores válidos
    // Caso base: inicialización con valores válidos
    test('inicializa correctamente con valores', () => {
        const r = new RentaProd('LINEAL', 40, 180);
        expect(r.modelo).toBe('LINEAL');
        expect(r.precioDia).toBe(40);
        expect(r.precioLineal).toBe(180);
    });

    // Caso: valores inválidos se convierten a 0
    test('convierte valores inválidos a 0', () => {
        const r = new RentaProd('LINEAL', 'abc', 'xyz');
        expect(r.precioDia).toBe(0);
        expect(r.precioLineal).toBe(0);
    });

    // Caso: modelo por defecto
    test('usa modelo por defecto si no se pasa', () => {
        const r = new RentaProd(undefined, 20, 100);
        expect(r.modelo).toBe('LINEAL'); // valor por defecto
        expect(r.precioDia).toBe(20);
        expect(r.precioLineal).toBe(100);
    });
    
    // Caso: actualizar precios
    test('actualizarPrecios cambia precioDia y precioLineal', () => {
        const r = new RentaProd('LINEAL', 40, 180);
        
        // Actualizo los precios
        r.actualizarPrecios(60, 250);
        
        // Verifico que se hayan actualizado
        expect(r.precioDia).toBe(60);
        expect(r.precioLineal).toBe(250);
    });

    // Caso: actualizarPrecios con valores inválidos
    test('actualizarPrecios convierte valores inválidos a 0', () => {
        const r = new RentaProd('LINEAL', 40, 180);
        r.actualizarPrecios('abc', null);
        expect(r.precioDia).toBe(0);       // inválido → 0
        expect(r.precioLineal).toBe(0);    // inválido → 0
    });

});