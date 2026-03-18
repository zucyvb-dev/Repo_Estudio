/**Maneja los test unitario sobre el modelo de Historial de Cliente */
const Historial = require('../../src/modelos/Historial');

describe('Historial', () => {
  
    // Caso base: inicialización con arrays
    test('inicializa correctamente con ventas y rentas', () => {
        const h = new Historial(['V001'], ['R001']);
        expect(h.ventas).toContain('V001');
        expect(h.rentas).toContain('R001');
    });

    // Caso: inicialización por defecto
    test('usa arrays vacíos por defecto', () => {
        const h = new Historial();
        expect(h.ventas).toEqual([]);
        expect(h.rentas).toEqual([]);
    });

    // Caso: insertarVentas válido
    test('insertarVentas agrega una venta válida', () => {
        const h = new Historial();
        h.insertarVentas({ id: 'V002', total: 100, productoId: 'P001' });
        expect(h.ventas).toHaveLength(1);
        expect(h.ventas[0].id).toBe('V002');
    });

    // Caso: insertarVentas inválido
    test('insertarVentas lanza error si ventaId es inválido', () => {
        const h = new Historial();
        expect(() => h.insertarVentas(null)).toThrow('Venta Inválida');
    });

    // Caso: insertarRenta válido
    test('insertarRenta agrega una renta válida', () => {
        const h = new Historial();
        h.insertarRenta({ id: 'R002', costo: 50, productoId: 'P002' });
        expect(h.rentas).toHaveLength(1);
        expect(h.rentas[0].id).toBe('R002');
    });

    // Caso: insertarRenta inválido
    test('insertarRenta lanza error si rentaId es inválido', () => {
        const h = new Historial();
        expect(() => h.insertarRenta(undefined)).toThrow('Renta Inválida');
    });

    // Caso: cantidadVentas y cantidadRentas
    test('cantidadVentas y cantidadRentas devuelven el tamaño correcto', () => {
        const h = new Historial([{ id: 'V001' }], [{ id: 'R001' }, { id: 'R002' }]);
        expect(h.cantidadVentas()).toBe(1);
        expect(h.cantidadRentas()).toBe(2);
    });

    // Caso: totalVentas y totalRentas
    test('totalVentas y totalRentas suman correctamente', () => {
        const h = new Historial(
        [{ id: 'V001', total: 100 }, { id: 'V002', total: 200 }],
        [{ id: 'R001', costo: 50 }, { id: 'R002', costo: 75 }]
        );
        expect(h.totalVentas()).toBe(300);
        expect(h.totalRentas()).toBe(125);
    });

    // Caso: operaciones
    test('operaciones devuelve la suma de ventas y rentas', () => {
        const h = new Historial([{ id: 'V001' }], [{ id: 'R001' }, { id: 'R002' }]);
        expect(h.operaciones()).toBe(3);
    });

    // Caso: idsOperaciones
    test('idsOperaciones devuelve todos los productoId de ventas y rentas', () => {
        const h = new Historial(
        [{ id: 'V001', productoId: 'P001' }],
        [{ id: 'R001', productoId: 'P002' }]
        );
        expect(h.idsOperaciones()).toEqual(['P001', 'P002']);
    });

});

