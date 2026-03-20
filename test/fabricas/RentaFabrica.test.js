/**Maneja los test unitarios de la creación de fábrica de Renta */
const RentaFabrica = require('../../src/fabricas/RentaFabrica');
const Renta = require('../../src/modelos/Renta');

describe('RentaFabrica', () => {

    // ---------------------------------------------------------
    // 1. Crear renta válida
    // ---------------------------------------------------------
    test('crearRenta → retorna un objeto Renta válido', () => {
        const datosRenta = {
            clienteId: "C001",
            productoId: "P001",
            modelo: "POR_DIA",
            dias: 3,
            devuelta: false
        };

        const producto = { id: "P001", rentaProd: { precioDia: 50, precioLineal: 200 } };
        const costo = 150;
        const fechaISO = "2024-01-01";

        const renta = RentaFabrica.crearRenta("R001", datosRenta, producto, costo, fechaISO);

        expect(renta).toBeInstanceOf(Renta);
        expect(renta.id).toBe("R001");
        expect(renta.clienteId).toBe("C001");
        expect(renta.productoId).toBe("P001");
        expect(renta.modelo).toBe("POR_DIA");
        expect(renta.dias).toBe(3);
        expect(renta.costo).toBe(150);
        expect(renta.fechaISO).toBe("2024-01-01");
        expect(renta.devuelta).toBe(false);
    });

    // ---------------------------------------------------------
    // 2. Error si falta clienteId
    // ---------------------------------------------------------
    test('crearRenta → lanza error si falta clienteId', () => {
        const datosRenta = {
            productoId: "P001",
            modelo: "POR_DIA",
            dias: 3
        };
        const producto = { id: "P001", rentaProd: { precioDia: 50 } };

        expect(() => RentaFabrica.crearRenta("R001", datosRenta, producto, 150, "2024-01-01"))
            .toThrow("clienteId no puede estar vacío");
    });

    // ---------------------------------------------------------
    // 3. Error si falta productoId
    // ---------------------------------------------------------
    test('crearRenta → lanza error si falta productoId', () => {
        const datosRenta = {
            clienteId: "C001",
            modelo: "POR_DIA",
            dias: 3
        };
        const producto = { id: "P001", rentaProd: { precioDia: 50 } };

        expect(() => RentaFabrica.crearRenta("R001", datosRenta, producto, 150, "2024-01-01"))
            .toThrow("productoId no puede estar vacío");
    });

    // ---------------------------------------------------------
    // 4. Error si modelo inválido
    // ---------------------------------------------------------
    test('crearRenta → lanza error si modelo inválido', () => {
        const datosRenta = {
            clienteId: "C001",
            productoId: "P001",
            modelo: "INVALIDO",
            dias: 3
        };
        const producto = { id: "P001", rentaProd: { precioDia: 50 } };

        expect(() => RentaFabrica.crearRenta("R001", datosRenta, producto, 150, "2024-01-01"))
            .toThrow("Modelo de renta inválido");
    });

    // ---------------------------------------------------------
    // 5. Error si días no es positivo
    // ---------------------------------------------------------
    test('crearRenta → lanza error si dias no es positivo', () => {
        const datosRenta = {
            clienteId: "C001",
            productoId: "P001",
            modelo: "POR_DIA",
            dias: 0
        };
        const producto = { id: "P001", rentaProd: { precioDia: 50 } };

        expect(() => RentaFabrica.crearRenta("R001", datosRenta, producto, 150, "2024-01-01"))
            .toThrow("dias debe ser positivo");
    });

    // ---------------------------------------------------------
    // 6. Devuelta por defecto
    // ---------------------------------------------------------
    test('crearRenta → asigna devuelta=false por defecto si no se pasa', () => {
        const datosRenta = {
            clienteId: "C001",
            productoId: "P001",
            modelo: "POR_DIA",
            dias: 3
        };
        const producto = { id: "P001", rentaProd: { precioDia: 50 } };

        const renta = RentaFabrica.crearRenta("R001", datosRenta, producto, 150, "2024-01-01");

        expect(renta.devuelta).toBe(false);
    });
});
