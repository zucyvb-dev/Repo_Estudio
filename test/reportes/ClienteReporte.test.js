/**Maneja los test unitarios de la clase de reportes del Cliente */
const ClienteReporte = require('../../src/reportes/ClienteReporte');

describe('ClienteReporte', () => {

    let clienteRepoMock;
    let ventaRepoMock;
    let rentaRepoMock;
    let servicio;

    beforeEach(() => {

        clienteRepoMock = {
            mostrarTodo: jest.fn()
        };

        ventaRepoMock = {
            buscarVentaPorCliente: jest.fn()
        };

        rentaRepoMock = {
            buscarRentaPorCliente: jest.fn()
        };

        servicio = new ClienteReporte(
            clienteRepoMock,
            ventaRepoMock,
            rentaRepoMock
        );
    });

    // ---------------------------------------------------------
    // 1. listarVentasPorCliente → retorna las ventas del cliente
    // ---------------------------------------------------------
    test('listarVentasPorCliente → retorna las ventas del cliente', () => {

        const ventas = [{ id: "V001" }, { id: "V002" }];
        ventaRepoMock.buscarVentaPorCliente.mockReturnValue(ventas);

        const result = servicio.listarVentasPorCliente("C001");

        expect(result).toEqual(ventas);
    });

    // ---------------------------------------------------------
    // 2. listarRentasPorCliente → retorna las rentas del cliente
    // ---------------------------------------------------------
    test('listarRentasPorCliente → retorna las rentas del cliente', () => {

        const rentas = [{ id: "R001" }, { id: "R002" }];
        rentaRepoMock.buscarRentaPorCliente.mockReturnValue(rentas);

        const result = servicio.listarRentasPorCliente("C001");

        expect(result).toEqual(rentas);
    });

    // ---------------------------------------------------------
    // 3. listarRentasDevueltasPorCliente → filtra solo las devueltas
    // ---------------------------------------------------------
    test('listarRentasDevueltasPorCliente → retorna solo las rentas devueltas', () => {

        const rentas = [
            { id: "R001", devuelta: true },
            { id: "R002", devuelta: false }
        ];

        rentaRepoMock.buscarRentaPorCliente.mockReturnValue(rentas);

        const result = servicio.listarRentasDevueltasPorCliente("C001");

        expect(result).toEqual([{ id: "R001", devuelta: true }]);
    });

    // ---------------------------------------------------------
    // 4. totalGastadoVentas → suma correctamente el total gastado
    // ---------------------------------------------------------
    test('totalGastadoVentas → suma correctamente el total gastado en ventas', () => {

        const ventas = [
            { total: 100 },
            { total: 50 }
        ];

        ventaRepoMock.buscarVentaPorCliente.mockReturnValue(ventas);

        const total = servicio.totalGastadoVentas("C001");

        expect(total).toBe(150);
    });

    // ---------------------------------------------------------
    // 5. totalGastadoRentas → suma correctamente el total gastado
    // ---------------------------------------------------------
    test('totalGastadoRentas → suma correctamente el total gastado en rentas', () => {

        const rentas = [
            { total: 40 },
            { total: 60 }
        ];

        rentaRepoMock.buscarRentaPorCliente.mockReturnValue(rentas);

        const total = servicio.totalGastadoRentas("C001");

        expect(total).toBe(100);
    });

    // ---------------------------------------------------------
    // 6. cantidadOperaciones → suma ventas + rentas
    // ---------------------------------------------------------
    test('cantidadOperaciones → suma correctamente ventas + rentas', () => {

        ventaRepoMock.buscarVentaPorCliente.mockReturnValue([{ id: "V1" }, { id: "V2" }]);
        rentaRepoMock.buscarRentaPorCliente.mockReturnValue([{ id: "R1" }]);

        const total = servicio.cantidadOperaciones("C001");

        expect(total).toBe(3);
    });

    test('cantidadOperaciones → maneja valores no array correctamente', () => {

        ventaRepoMock.buscarVentaPorCliente.mockReturnValue(2);
        rentaRepoMock.buscarRentaPorCliente.mockReturnValue(3);

        const total = servicio.cantidadOperaciones("C001");

        expect(total).toBe(5);
    });

    // ---------------------------------------------------------
    // 7. historialOperaciones → retorna IDs de ventas y rentas
    // ---------------------------------------------------------
    test('historialOperaciones → retorna correctamente los IDs de ventas y rentas', () => {

        ventaRepoMock.buscarVentaPorCliente.mockReturnValue([
            { id: "V1" },
            { id: "V2" }
        ]);

        rentaRepoMock.buscarRentaPorCliente.mockReturnValue([
            { id: "R1" }
        ]);

        const historial = servicio.historialOperaciones("C001");

        expect(historial).toEqual({
            ventas: ["V1", "V2"],
            rentas: ["R1"]
        });
    });

    // ---------------------------------------------------------
    // 8. generarReporteCliente → genera el reporte completo
    // ---------------------------------------------------------
    test('generarReporteCliente → genera correctamente el reporte completo del cliente', () => {

        ventaRepoMock.buscarVentaPorCliente.mockReturnValue([
            { id: "V1", total: 100 }
        ]);

        rentaRepoMock.buscarRentaPorCliente.mockReturnValue([
            { id: "R1", total: 50, devuelta: true }
        ]);

        const reporte = servicio.generarReporteCliente("C001");

        expect(reporte).toEqual({
            clienteId: "C001",
            ventas: 1,
            rentas: 1,
            devueltas: 1,
            totalVentas: 100,
            totalRentas: 50,
            operaciones: 2,
            historial: {
                ventas: ["V1"],
                rentas: ["R1"]
            }
        });
    });

});
