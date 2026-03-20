/**Maneja los test unitarios de la creación de fábrica de Venta */
const VentaFabrica = require('../../src/fabricas/VentaFabrica');
const Venta = require('../../src/modelos/Venta');
const Item = require('../../src/modelos/Item');

describe('VentaFabrica', () => {

    // ---------------------------------------------------------
    // 1. Crear venta válida
    // ---------------------------------------------------------
    test('crearVenta → retorna un objeto Venta válido con Items instanciados', () => {
        const items = [
            { productoId: "P001", cantidad: 2, precioUnitario: 100 }
        ];
        const subtotal = 200;
        const tax = 20;
        const total = 220;
        const fechaISO = "2024-01-01";

        const venta = VentaFabrica.crearVenta("V001", "C001", items, subtotal, tax, total, fechaISO);

        expect(venta).toBeInstanceOf(Venta);
        expect(venta.id).toBe("V001");
        expect(venta.clienteId).toBe("C001");
        expect(venta.items.length).toBe(1);
        expect(venta.items[0]).toBeInstanceOf(Item);
        expect(venta.items[0].productoId).toBe("P001");
        expect(venta.items[0].cantidad).toBe(2);
        expect(venta.items[0].precioUnitario).toBe(100);
        expect(venta.subtotal).toBe(200);
        expect(venta.tax).toBe(20);
        expect(venta.total).toBe(220);
        expect(venta.fechaISO).toBe("2024-01-01");
    });

    // ---------------------------------------------------------
    // 2. Error si falta idVenta
    // ---------------------------------------------------------
    test('crearVenta → lanza error si falta idVenta', () => {
        const items = [{ productoId: "P001", cantidad: 1, precioUnitario: 100 }];
        expect(() => VentaFabrica.crearVenta("", "C001", items, 100, 10, 110, "2024-01-01"))
            .toThrow("idVenta no puede estar vacío");
    });

    // ---------------------------------------------------------
    // 3. Error si falta clienteId
    // ---------------------------------------------------------
    test('crearVenta → lanza error si falta clienteId', () => {
        const items = [{ productoId: "P001", cantidad: 1, precioUnitario: 100 }];
        expect(() => VentaFabrica.crearVenta("V001", "", items, 100, 10, 110, "2024-01-01"))
            .toThrow("clienteId no puede estar vacío");
    });

    // ---------------------------------------------------------
    // 4. Error si items está vacío
    // ---------------------------------------------------------
    test('crearVenta → lanza error si items está vacío', () => {
        expect(() => VentaFabrica.crearVenta("V001", "C001", [], 100, 10, 110, "2024-01-01"))
            .toThrow("La venta debe tener al menos un item.");
    });

    // ---------------------------------------------------------
    // 5. Error si item no tiene productoId
    // ---------------------------------------------------------
    test('crearVenta → lanza error si item no tiene productoId', () => {
        const items = [{ cantidad: 1, precioUnitario: 100 }];
        expect(() => VentaFabrica.crearVenta("V001", "C001", items, 100, 10, 110, "2024-01-01"))
            .toThrow("productoId no puede estar vacío");
    });

    // ---------------------------------------------------------
    // 6. Error si cantidad no es positiva
    // ---------------------------------------------------------
    test('crearVenta → lanza error si cantidad no es positiva', () => {
        const items = [{ productoId: "P001", cantidad: 0, precioUnitario: 100 }];
        expect(() => VentaFabrica.crearVenta("V001", "C001", items, 0, 0, 0, "2024-01-01"))
            .toThrow("cantidad debe ser positivo");
    });

    // ---------------------------------------------------------
    // 7. Error si precioUnitario no es positivo
    // ---------------------------------------------------------
    test('crearVenta → lanza error si precioUnitario no es positivo', () => {
        const items = [{ productoId: "P001", cantidad: 1, precioUnitario: -100 }];
        expect(() => VentaFabrica.crearVenta("V001", "C001", items, -100, 0, -100, "2024-01-01"))
            .toThrow("precioUnitario debe ser positivo");
    });

    // ---------------------------------------------------------
    // 8. Error si subtotal/tax/total no son positivos
    // ---------------------------------------------------------
    test('crearVenta → lanza error si subtotal no es positivo', () => {
        const items = [{ productoId: "P001", cantidad: 1, precioUnitario: 100 }];
        expect(() => VentaFabrica.crearVenta("V001", "C001", items, -100, 10, -90, "2024-01-01"))
            .toThrow("subtotal debe ser positivo");
    });

    // ---------------------------------------------------------
    // 9. Error si falta fechaISO
    // ---------------------------------------------------------
    test('crearVenta → lanza error si falta fechaISO', () => {
        const items = [{ productoId: "P001", cantidad: 1, precioUnitario: 100 }];
        expect(() => VentaFabrica.crearVenta("V001", "C001", items, 100, 10, 110, ""))
            .toThrow("fechaISO no puede estar vacío");
    });
});
