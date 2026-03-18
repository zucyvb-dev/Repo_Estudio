/**Maneja los test unitarios de la clase de reportes BalanceGeneral */
const BalanceGeneral = require('../../src/reportes/BalanceGeneral');

describe('BalanceGeneral', () => {

    let clienteRepoMock;
    let productoRepoMock;
    let ventaRepoMock;
    let rentaRepoMock;
    let servicio;

    beforeEach(() => {

        clienteRepoMock = {
            mostrarTodo: jest.fn()
        };

        productoRepoMock = {
            mostrarTodo: jest.fn()
        };

        ventaRepoMock = {
            mostrarTodo: jest.fn()
        };

        rentaRepoMock = {
            mostrarTodo: jest.fn()
        };

        servicio = new BalanceGeneral(
            clienteRepoMock,
            productoRepoMock,
            ventaRepoMock,
            rentaRepoMock
        );
    });

    // ---------------------------------------------------------
    // 1. generarBalanceGeneral → calcula correctamente ingresos por ventas
    // ---------------------------------------------------------
    test('generarBalanceGeneral → calcula correctamente los ingresos por ventas', () => {

        ventaRepoMock.mostrarTodo.mockReturnValue([
            { costo: 100 },
            { costo: 200 }
        ]);

        rentaRepoMock.mostrarTodo.mockReturnValue([]);
        clienteRepoMock.mostrarTodo.mockReturnValue([]);
        productoRepoMock.mostrarTodo.mockReturnValue([]);

        const balance = servicio.generarBalanceGeneral();

        expect(balance.ingresosVentas).toBe(300);
    });

    // ---------------------------------------------------------
    // 2. generarBalanceGeneral → calcula correctamente ingresos por rentas
    // ---------------------------------------------------------
    test('generarBalanceGeneral → calcula correctamente los ingresos por rentas', () => {

        ventaRepoMock.mostrarTodo.mockReturnValue([]);
        rentaRepoMock.mostrarTodo.mockReturnValue([
            { costo: 50 },
            { costo: 150 }
        ]);

        clienteRepoMock.mostrarTodo.mockReturnValue([]);
        productoRepoMock.mostrarTodo.mockReturnValue([]);

        const balance = servicio.generarBalanceGeneral();

        expect(balance.ingresosRentas).toBe(200);
    });

    // ---------------------------------------------------------
    // 3. generarBalanceGeneral → calcula correctamente el total general
    // ---------------------------------------------------------
    test('generarBalanceGeneral → calcula correctamente el total general', () => {

        ventaRepoMock.mostrarTodo.mockReturnValue([{ costo: 100 }]);
        rentaRepoMock.mostrarTodo.mockReturnValue([{ costo: 50 }]);

        clienteRepoMock.mostrarTodo.mockReturnValue([]);
        productoRepoMock.mostrarTodo.mockReturnValue([]);

        const balance = servicio.generarBalanceGeneral();

        expect(balance.totalGeneral).toBe(150);
    });

    // ---------------------------------------------------------
    // 4. generarBalanceGeneral → determina correctamente el cliente que más gastó
    // ---------------------------------------------------------
    test('generarBalanceGeneral → determina correctamente el cliente que más gastó', () => {

        ventaRepoMock.mostrarTodo.mockReturnValue([]);
        rentaRepoMock.mostrarTodo.mockReturnValue([]);

        clienteRepoMock.mostrarTodo.mockReturnValue([
            {
                id: "C001",
                nombre: "Zucel",
                historial: {
                    ventas: [{ costo: 100 }],
                    rentas: [{ costo: 50 }]
                }
            },
            {
                id: "C002",
                nombre: "Ana",
                historial: {
                    ventas: [{ costo: 20 }],
                    rentas: [{ costo: 10 }]
                }
            }
        ]);

        productoRepoMock.mostrarTodo.mockReturnValue([]);

        const balance = servicio.generarBalanceGeneral();

        expect(balance.clienteMasGasto.nombre).toBe("Zucel");
        expect(balance.clienteMasGasto.gastoTotal).toBe(150);
    });

    // ---------------------------------------------------------
    // 5. generarBalanceGeneral → calcula correctamente el porcentaje de productos almacenados
    // ---------------------------------------------------------
    test('generarBalanceGeneral → calcula correctamente el porcentaje de productos almacenados', () => {

        ventaRepoMock.mostrarTodo.mockReturnValue([]);
        rentaRepoMock.mostrarTodo.mockReturnValue([]);
        clienteRepoMock.mostrarTodo.mockReturnValue([]);

        productoRepoMock.mostrarTodo.mockReturnValue([
            { stock: 5 },
            { stock: 0 },
            { stock: 3 }
        ]);

        const balance = servicio.generarBalanceGeneral();

        // 2 de 3 productos tienen stock > 0 → 66%
        expect(balance.porcentajeProductosAlmacenados).toBe(67);
    });

    // ---------------------------------------------------------
    // 6. generarBalanceGeneral → retorna 0% si no hay productos
    // ---------------------------------------------------------
    test('generarBalanceGeneral → retorna 0% si no hay productos', () => {

        ventaRepoMock.mostrarTodo.mockReturnValue([]);
        rentaRepoMock.mostrarTodo.mockReturnValue([]);
        clienteRepoMock.mostrarTodo.mockReturnValue([]);
        productoRepoMock.mostrarTodo.mockReturnValue([]);

        const balance = servicio.generarBalanceGeneral();

        expect(balance.porcentajeProductosAlmacenados).toBe(0);
    });

});
