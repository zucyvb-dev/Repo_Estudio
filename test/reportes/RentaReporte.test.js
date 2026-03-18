/**Maneja los test unitarios de la clase reportes de Renta */
const RentaReporte = require('../../src/reportes/RentaReporte');

describe('RentaReporte', () => {

    let rentaRepoMock;
    let servicio;

    beforeEach(() => {

        rentaRepoMock = {
            mostrarTodo: jest.fn(),
            buscarRentaPorFecha: jest.fn(),
            buscarRentaPorCliente: jest.fn()
        };

        servicio = new RentaReporte(rentaRepoMock);
    });

    // ---------------------------------------------------------
    // 1. listarRentas → retorna todas las rentas formateadas
    // ---------------------------------------------------------
    test('listarRentas → retorna todas las rentas formateadas correctamente', () => {

        rentaRepoMock.mostrarTodo.mockReturnValue([
            {
                id: "R1",
                clienteId: "C1",
                productoId: "P1",
                modelo: "POR_DIA",
                dias: 3,
                costo: 100,
                fechaISO: "2024-01-01",
                devuelta: true
            }
        ]);

        const result = servicio.listarRentas();

        expect(result).toEqual([
            {
                id: "R1",
                clienteId: "C1",
                productoId: "P1",
                modelo: "POR_DIA",
                dias: 3,
                costo: 100,
                fechaISO: "2024-01-01",
                devuelta: "Sí"
            }
        ]);
    });

    // ---------------------------------------------------------
    // 2. listarRentasActivas → retorna solo rentas no devueltas
    // ---------------------------------------------------------
    test('listarRentasActivas → retorna solo rentas activas', () => {

        rentaRepoMock.mostrarTodo.mockReturnValue([
            { id: "R1", devuelta: false, clienteId: "C1", productoId: "P1", modelo: "LINEAL", dias: 2, costo: 50, fechaISO: "2024-01-02" },
            { id: "R2", devuelta: true }
        ]);

        const result = servicio.listarRentasActivas();

        expect(result).toEqual([
            {
                id: "R1",
                clienteId: "C1",
                productoId: "P1",
                modelo: "LINEAL",
                dias: 2,
                costo: 50,
                fechaISO: "2024-01-02"
            }
        ]);
    });

    // ---------------------------------------------------------
    // 3. listarRentasPorFecha → filtra rentas por fecha
    // ---------------------------------------------------------
    test('listarRentasPorFecha → retorna rentas filtradas por fecha', () => {

        rentaRepoMock.buscarRentaPorFecha.mockReturnValue([
            { id: "R1", clienteId: "C1", productoId: "P1", modelo: "POR_DIA", dias: 3, costo: 100, devuelta: false }
        ]);

        const result = servicio.listarRentasPorFecha("2024-01-01");

        expect(result).toEqual([
            {
                id: "R1",
                clienteId: "C1",
                productoId: "P1",
                modelo: "POR_DIA",
                dias: 3,
                costo: 100,
                devuelta: "No"
            }
        ]);
    });

    // ---------------------------------------------------------
    // 4. listarRentasPorPeriodo → filtra rentas entre dos fechas
    // ---------------------------------------------------------
    test('listarRentasPorPeriodo → retorna rentas dentro del periodo', () => {

        rentaRepoMock.mostrarTodo.mockReturnValue([
            { id: "R1", fechaISO: "2024-01-01", clienteId: "C1", productoId: "P1", modelo: "LINEAL", dias: 1, costo: 20, devuelta: false },
            { id: "R2", fechaISO: "2024-02-01", clienteId: "C2", productoId: "P2", modelo: "POR_DIA", dias: 2, costo: 40, devuelta: true },
            { id: "R3", fechaISO: "2023-12-01", clienteId: "C3", productoId: "P3", modelo: "LINEAL", dias: 5, costo: 100, devuelta: false }
        ]);

        const result = servicio.listarRentasPorPeriodo("2024-01-01", "2024-02-15");

        expect(result).toEqual([
            {
                id: "R1",
                clienteId: "C1",
                productoId: "P1",
                modelo: "LINEAL",
                dias: 1,
                costo: 20,
                fechaISO: "2024-01-01",
                devuelta: "No"
            },
            {
                id: "R2",
                clienteId: "C2",
                productoId: "P2",
                modelo: "POR_DIA",
                dias: 2,
                costo: 40,
                fechaISO: "2024-02-01",
                devuelta: "Sí"
            }
        ]);
    });

    // ---------------------------------------------------------
    // 5. totalRentas → retorna cantidad total de rentas
    // ---------------------------------------------------------
    test('totalRentas → retorna la cantidad total de rentas', () => {

        rentaRepoMock.mostrarTodo.mockReturnValue([
            { id: "R1" },
            { id: "R2" }
        ]);

        const total = servicio.totalRentas();

        expect(total).toBe(2);
    });

    // ---------------------------------------------------------
    // 6. ingresosPorRentas → suma correctamente los ingresos
    // ---------------------------------------------------------
    test('ingresosPorRentas → suma correctamente los ingresos por rentas', () => {

        rentaRepoMock.mostrarTodo.mockReturnValue([
            { costo: 50 },
            { costo: 100 }
        ]);

        const total = servicio.ingresosPorRentas();

        expect(total).toBe(150);
    });

    // ---------------------------------------------------------
    // 7. generarReporteGeneralRentas → genera el reporte general
    // ---------------------------------------------------------
    test('generarReporteGeneralRentas → genera correctamente el reporte general de rentas', () => {

        rentaRepoMock.mostrarTodo.mockReturnValue([
            { id: "R1", devuelta: false, costo: 50 },
            { id: "R2", devuelta: true, costo: 100 }
        ]);

        const reporte = servicio.generarReporteGeneralRentas();

        expect(reporte).toEqual({
            totalRentas: 2,
            activas: 1,
            devueltas: 1,
            ingresosTotales: 150
        });
    });

});
