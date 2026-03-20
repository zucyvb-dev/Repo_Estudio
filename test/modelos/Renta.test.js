/**Maneja los test unitarios del modelo de Rentas */
const Renta = require('../../src/modelos/Renta');
const RentaFabrica = require('../../src/fabricas/RentaFabrica');

describe('Renta', () => {
  
  // Caso base: inicialización con valores válidos
  test('inicializa correctamente con valores', () => {
    const datos = {
        id: 'R001',
        clienteId: 'C001',
        productoId: 'P001',
        modelo: 'LINEAL',
        dias: 5,
        costo: 200,
        fechaISO: '2026-03-17',
        devuelta: true
    };

    const r = RentaFabrica.crearRenta(datos);

    expect(r.id).toBe('R001');
    expect(r.clienteId).toBe('C001');
    expect(r.productoId).toBe('P001');
    expect(r.modelo).toBe('LINEAL');
    expect(r.dias).toBe(5);
    expect(r.costo).toBe(200);
    expect(r.fechaISO).toBe('2026-03-17');
    expect(r.devuelta).toBe(true);
  });

  // Caso: valores inválidos en dias y costo
  test('convierte valores inválidos en dias y costo a 0', () => {
    const r = RentaFabrica.crearRenta('R002', 'C002', 'P002', 'POR_DIA', 'abc', 'xyz', '2026-03-18', false);
    expect(r.dias).toBe(0);
    expect(r.costo).toBe(0);
  });

  // Caso: devuelta se convierte a booleano
  test('devuelta se convierte a booleano', () => {
    const rTruthy = RentaFabrica.crearRenta('R003', 'C003', 'P003', 'LINEAL', 3, 150, '2026-03-19', 'yes');
    const rFalsy = RentaFabrica.crearRenta('R004', 'C004', 'P004', 'LINEAL', 2, 100, '2026-03-20', 0);
    expect(rTruthy.devuelta).toBe(true);
    expect(rFalsy.devuelta).toBe(false);
  });

  // Caso: inicialización con valores por defecto
  test('inicializa con valores por defecto si no se pasan', () => {
    const r = RentaFabrica.crearRenta();
    expect(r.id).toBeUndefined();
    expect(r.clienteId).toBeUndefined();
    expect(r.productoId).toBeUndefined();
    expect(r.modelo).toBeUndefined();
    expect(r.dias).toBe(0);
    expect(r.costo).toBe(0);
    expect(r.fechaISO).toBeUndefined();
    expect(r.devuelta).toBe(false);
  });

});
