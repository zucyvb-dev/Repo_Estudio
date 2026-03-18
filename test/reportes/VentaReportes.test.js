/**Maneja los test unitarios de la clase reportes de Venta */
const VentaReportes = require('../../src/reportes/VentaReportes');

describe('VentaReportes', () => {

    let ventaRepoMock;
    let servicio;

    beforeEach(() => {

        ventaRepoMock = {
            buscarVentaPorCliente: jest.fn(),
            buscarVentaPorFecha: jest.fn(),
            mostrarTodo: jest.fn()
        };

        servicio = new VentaReportes(ventaRepoMock);
    });

    // ---------------------------------------------------------
    // 1. ventasPorCliente → retorna ventas del cliente
    // ---------------------------------------------------------
    test('ventasPorCliente → retorna las ventas del cliente', () => {

        const ventas = [{ id: "V1" }, { id: "V2" }];
        ventaRepoMock.buscarVentaPorCliente.mockReturnValue(ventas);

        const result = servicio.ventasPorCliente("C001");

        expect(result).toEqual(ventas);
    });

    // ---------------------------------------------------------
    // 2. ventasPorFechaISO → retorna ventas por fecha
    // ---------------------------------------------------------
    test('ventasPorFechaISO → retorna ventas filtradas por fecha', () => {

        const ventas = [{ id: "V1" }];
        ventaRepoMock.buscarVentaPorFecha.mockReturnValue(ventas);

        const result = servicio.ventasPorFechaISO("2024-01-01");

        expect(result).toEqual(ventas);
    });

    // ---------------------------------------------------------
    // 3. totalVentas → suma correctamente el total de ventas
    // ---------------------------------------------------------
    test('totalVentas → suma correctamente el total de ventas', () => {

        ventaRepoMock.mostrarTodo.mockReturnValue([
            { total: 100 },
            { total: 50 }
        ]);

        const total = servicio.totalVentas();

        expect(total).toBe(150);
    });

    // ---------------------------------------------------------
    // 4. totalVentasPorFecha → suma ventas desde una fecha
    // ---------------------------------------------------------
    test('totalVentasPorFecha → suma ventas desde una fecha dada', () => {

        ventaRepoMock.mostrarTodo.mockReturnValue([
            { fechaISO: "2024-01-01", total: 100 },
            { fechaISO: "2023-12-01", total: 50 }
        ]);

        const total = servicio.totalVentasPorFecha("2024-01-01");

        expect(total).toBe(100);
    });

    // ---------------------------------------------------------
    // 5. totalVentasPeriodo → suma ventas dentro de un periodo
    // ---------------------------------------------------------
    test('totalVentasPeriodo → suma ventas dentro del periodo', () => {

        ventaRepoMock.mostrarTodo.mockReturnValue([
            { fechaISO: "2024-01-01", total: 100 },
            { fechaISO: "2024-02-01", total: 50 },
            { fechaISO: "2023-12-01", total: 20 }
        ]);

        const total = servicio.totalVentasPeriodo("2024-01-01", "2024-02-15");

        expect(total).toBe(150);
    });

    // ---------------------------------------------------------
    // 6. productosMasVendidos → retorna conteo de productos vendidos
    // ---------------------------------------------------------
    test('productosMasVendidos → retorna conteo de productos vendidos', () => {

        ventaRepoMock.mostrarTodo.mockReturnValue([
            {
                items: [
                    { productoId: "P1", cantidad: 2 },
                    { productoId: "P2", cantidad: 1 }
                ]
            },
            {
                items: [
                    { productoId: "P1", cantidad: 3 }
                ]
            }
        ]);

        const result = servicio.productosMasVendidos();

        expect(result).toEqual({
            P1: 5,
            P2: 1
        });
    });

    // ---------------------------------------------------------
    // 7. ingresosPorVentas → suma correctamente los ingresos por ventas
    // ---------------------------------------------------------
    test('ingresosPorVentas → suma correctamente los ingresos por ventas', () => {

        ventaRepoMock.mostrarTodo.mockReturnValue([
            { costo: 100 },
            { costo: 50 },
            { costo: "no-numérico" }
        ]);

        const total = servicio.ingresosPorVentas();

        expect(total).toBe(150);
    });

    // ---------------------------------------------------------
    // 8. generarReporteGeneralVentas → genera el reporte general de ventas
    // ---------------------------------------------------------
    test('generarReporteGeneralVentas → genera correctamente el reporte general', () => {

        ventaRepoMock.mostrarTodo.mockReturnValue([
            {
                total: 100,
                costo: 100,
                items: [{ productoId: "P1", cantidad: 2 }]
            },
            {
                total: 50,
                costo: 50,
                items: [{ productoId: "P1", cantidad: 1 }]
            }
        ]);

        const reporte = servicio.generarReporteGeneralVentas();

        expect(reporte).toEqual({
            totalVentas: 150,
            productosMasVendidos: { P1: 3 },
            ingresosTotales: 150
        });
    });

});
