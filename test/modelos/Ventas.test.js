/**Maneja los test unitarios del modelo de Ventas con su clase hija Items */
const Venta = require('../../src/modelos/Venta');
const ItemVenta = require('../../src/modelos/Item');
const VentaFabrica = require('../../src/fabricas/VentaFabrica');

describe('Venta', () => {
  
  // Caso base: inicialización con ItemVenta válido
  test('inicializa correctamente con ItemVenta', () => {
    const item = new ItemVenta('P001', 2, 100);
    const datos = {
        id: 'V001',
        clienteId: 'C001',
        items: [item],
        subtotal: 200,
        taxId: 20,
        total: 220,
        fechaISO: '2026-03-17'
    };

    const v = VentaFabrica.crearVenta(datos);
    
    expect(v.id).toBe('V001');
    expect(v.clienteId).toBe('C001');
    expect(v.items[0]).toBeInstanceOf(ItemVenta);
    expect(v.subtotal).toBe(200);
    expect(v.taxId).toBe(20);
    expect(v.total).toBe(220);
    expect(v.fechaISO).toBe('2026-03-17');
  });

  // Caso: inicialización con literal de item
  test('convierte literal de item a ItemVenta', () => {
    const itemLiteral = { productoId: 'P002', cantidad: 1, precioUnitario: 50 };
    const v = VentaFabrica.crearVenta('V002', 'C002', [itemLiteral], 50, 5, 55, '2026-03-18');
    
    expect(v.items[0]).toBeInstanceOf(ItemVenta);
    expect(v.items[0].productoId).toBe('P002');
    expect(v.items[0].cantidad).toBe(1);
    expect(v.items[0].precioUnitario).toBe(50);
  });

  // Caso: valores inválidos en subtotal, taxId y total
  test('valores inválidos en subtotal, taxId y total se convierten a 0', () => {
    const v = VentaFabrica.crearVenta('V003', 'C003', [], 'abc', null, 'NaN', '2026-03-19');
    
    expect(v.subtotal).toBe(0);
    expect(v.taxId).toBe(0);
    expect(v.total).toBe(0);
  });

  // Caso: items vacíos
  test('items vacíos inicializan como array vacío', () => {
    const v = VentaFabrica.crearVenta('V004', 'C004', [], 0, 0, 0, '2026-03-20');
    expect(v.items).toEqual([]);
  });

});
