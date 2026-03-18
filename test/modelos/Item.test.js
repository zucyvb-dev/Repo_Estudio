/**Maneja los test unitarios del modelo de Item de Ventas */
const ItemVenta = require('../../src/modelos/Item');

describe('Item', () => {
  
  test('inicializa correctamente con valores', () => {
    const item = new ItemVenta('P001', 2, 100);
    expect(item.productoId).toBe('P001');
    expect(item.cantidad).toBe(2);
    expect(item.precioUnitario).toBe(100);
  });

  test('convierte valores inválidos a 0', () => {
    const item = new ItemVenta('P002', 'abc', 'xyz');
    expect(item.cantidad).toBe(0);
    expect(item.precioUnitario).toBe(0);
  });

  test('calcularSubTotal devuelve cantidad * precioUnitario', () => {
    const item = new ItemVenta('P003', 3, 20);
    expect(item.calcularSubTotal()).toBe(60); // 3 * 20
  });

  test('calcularSubTotal devuelve 0 si cantidad o precioUnitario son inválidos', () => {
    const item = new ItemVenta('P004', 0, 50);
    expect(item.calcularSubTotal()).toBe(0);

    const item2 = new ItemVenta('P005', 2, 0);
    expect(item2.calcularSubTotal()).toBe(0);
  });

});
