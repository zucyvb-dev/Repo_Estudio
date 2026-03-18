/**Maneja los test unitarios del modelo de Producto y de sus clases hijas RentaProd y Estado */
const Producto = require('../../src/modelos/Producto');
const RentaProd = require('../../src/modelos/RentaProd');
const Estado = require('../../src/modelos/Estado');

//Test unitarios de Producto
describe('Producto', () => {
    
    // Caso base: inicialización con objetos válidos
    test('inicializa correctamente con RentaProd y Estado', () => { 
        //Inicializo los valores de las clases hijas y del objeto producto
        const renta = new RentaProd('LINEAL', 40, 180);
        const estado = new Estado(false, null);
        const p = new Producto('P001', 'Laptop', 'tech', 900, true, renta, 5, estado);

        //Verifico a través de expectativas la calidad del dato
        expect(p.id).toBe('P001');
        expect(p.nombre).toBe('Laptop');
        expect(p.categoria).toBe('tech');
        expect(p.precioVenta).toBe(900);
        expect(p.rentable).toBe(true);
        expect(p.rentaProd).toBeInstanceOf(RentaProd);
        expect(p.rentaProd.modelo).toBe('LINEAL');
        expect(p.rentaProd.precioDia).toBe(40);
        expect(p.rentaProd.precioLineal).toBe(180);
        expect(p.stock).toBe(5);
        expect(p.estado).toBeInstanceOf(Estado);
        expect(p.estado.rentado).toBe(false);
        expect(p.estado.clienteId).toBeNull();
    });

    // Caso: renta como objeto literal
    test('convierte literal renta a RentaProd', () => {
        const rentaLiteral = { modelo: 'LINEAL', precioDia: '50', precioLineal: '200' };
        const p = new Producto('P002', 'Proyector', 'tech', 500, false, rentaLiteral, 2, {});
        expect(p.rentaProd).toBeInstanceOf(RentaProd);
        expect(p.rentaProd.precioDia).toBe(50);
        expect(p.rentaProd.precioLineal).toBe(200);
    });

    // Caso: rentaProd null
    test('rentaProd queda null si se pasa null', () => {
        const p = new Producto('P003', 'Cámara', 'tech', 1000, true, null, 1, {});
        expect(p.rentaProd).toBeNull();
    });

    // Caso: estado como objeto literal
    test('estado se crea desde literal', () => {
        const estadoLiteral = { rentado: true, clienteId: 'C123' };
        const p = new Producto('P004', 'Silla', 'muebles', 300, false, {}, 6, estadoLiteral);
        expect(p.estado).toBeInstanceOf(Estado);
        expect(p.estado.rentado).toBe(true);
        expect(p.estado.clienteId).toBe('C123');
    });

    // Caso: estado por defecto
    test('estado por defecto cuando no se pasa nada', () => {
        const p = new Producto('P005', 'Mesa', 'muebles', 200, false, {}, 4);
        expect(p.estado).toBeInstanceOf(Estado);
        expect(p.estado.rentado).toBe(false);
        expect(p.estado.clienteId).toBeNull();
    });

    // Caso: rentable coercionado a booleano
    test('rentable se coerciona a booleano', () => {
        const pTruthy = new Producto('P006', 'Consola', 'tech', 450, 'yes', {}, 3, {});
        const pFalsy = new Producto('P007', 'Joystick', 'tech', 60, 0, {}, 10, {});
        expect(pTruthy.rentable).toBe(true);
        expect(pFalsy.rentable).toBe(false);
    });

    // Caso: precioVenta y stock inválidos
    test('precioVenta y stock inválidos se convierten a 0', () => {
    const p = new Producto('P008', 'Accesorio', 'tech', 'no-num', true, {}, 'NaN', {});
    expect(p.precioVenta).toBe(0);
    expect(p.stock).toBe(0);
    });

    // Caso: parámetros por defecto renta y estado vacíos
    test('usa valores por defecto si no se pasan renta y estado', () => {
    const p = new Producto('P009', 'Lampara', 'hogar', 120, false);
    expect(p.rentaProd).toBeNull();
    expect(p.estado).toBeInstanceOf(Estado);
    expect(p.stock).toBe(0);
    expect(p.precioVenta).toBe(120);
    });

});
