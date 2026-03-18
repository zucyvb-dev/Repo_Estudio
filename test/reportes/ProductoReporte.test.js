/**Maneja los test unitarios de la clase reportes de Producto */
const ProductoReporte = require('../../src/reportes/ProductoReporte');
const Validador = require('../../src/utiles/Validador');

// Mock del Validador
jest.mock('../../src/utiles/Validador', () => ({
    validarStock: jest.fn()
}));

describe('ProductoReporte', () => {

    let productoRepoMock;
    let ventaRepoMock;
    let rentaRepoMock;
    let servicio;

    beforeEach(() => {

        productoRepoMock = {
            mostrarTodo: jest.fn(),
            buscarPorId: jest.fn()
        };

        ventaRepoMock = {
            buscarVentaPorProducto: jest.fn()
        };

        rentaRepoMock = {
            buscarRentaPorProducto: jest.fn()
        };

        servicio = new ProductoReporte(
            productoRepoMock,
            ventaRepoMock,
            rentaRepoMock
        );
    });

    // ---------------------------------------------------------
    // 1. listarProductos → retorna todos los productos
    // ---------------------------------------------------------
    test('listarProductos → retorna todos los productos', () => {

        const productos = [
            { id: "P1", nombre: "Laptop", stock: 5 },
            { id: "P2", nombre: "Mouse", stock: 10 }
        ];

        productoRepoMock.mostrarTodo.mockReturnValue(productos);

        const result = servicio.listarProductos();

        expect(result).toEqual(productos);
    });

    // ---------------------------------------------------------
    // 2. obtenerResumenProducto → retorna resumen con id, nombre y precio
    // ---------------------------------------------------------
    test('obtenerResumenProducto → retorna resumen correcto de productos', () => {

        productoRepoMock.mostrarTodo.mockReturnValue([
            { id: "P1", nombre: "Laptop", precioVenta: 500 },
            { id: "P2", nombre: "Mouse", precioVenta: 20 }
        ]);

        const result = servicio.obtenerResumenProducto();

        expect(result).toEqual([
            { id: "P1", nombre: "Laptop", precio: 500 },
            { id: "P2", nombre: "Mouse", precio: 20 }
        ]);
    });

    // ---------------------------------------------------------
    // 3. productosRentables → filtra productos rentables
    // ---------------------------------------------------------
    test('productosRentables → retorna solo productos rentables', () => {

        productoRepoMock.mostrarTodo.mockReturnValue([
            { id: "P1", rentable: true },
            { id: "P2", rentable: false }
        ]);

        const result = servicio.productosRentables();

        expect(result).toEqual([{ id: "P1", rentable: true }]);
    });

    // ---------------------------------------------------------
    // 4. productorSinStock → retorna productos sin stock
    // ---------------------------------------------------------
    test('productorSinStock → retorna productos sin stock', () => {

        const productos = [
            { id: "P1", stock: 0 },
            { id: "P2", stock: 5 }
        ];

        productoRepoMock.mostrarTodo.mockReturnValue(productos);

        // Mock: validarStock devuelve false cuando stock <= 0
        Validador.validarStock.mockImplementation((p) => p.stock > 0);

        const result = servicio.productorSinStock();

        expect(result).toEqual([{ id: "P1", stock: 0 }]);
    });

    // ---------------------------------------------------------
    // 5. listarVentasPorProducto → retorna ventas del producto
    // ---------------------------------------------------------
    test('listarVentasPorProducto → retorna ventas del producto', () => {

        const ventas = [{ id: "V1" }, { id: "V2" }];
        ventaRepoMock.buscarVentaPorProducto.mockReturnValue(ventas);

        const result = servicio.listarVentasPorProducto("P1");

        expect(result).toEqual(ventas);
    });

    // ---------------------------------------------------------
    // 6. listarRentasPorProducto → retorna rentas del producto
    // ---------------------------------------------------------
    test('listarRentasPorProducto → retorna rentas del producto', () => {

        const rentas = [{ id: "R1" }, { id: "R2" }];
        rentaRepoMock.buscarRentaPorProducto.mockReturnValue(rentas);

        const result = servicio.listarRentasPorProducto("P1");

        expect(result).toEqual(rentas);
    });

    // ---------------------------------------------------------
    // 7. listarRentasDevueltasPorProductos → filtra rentas devueltas
    // ---------------------------------------------------------
    test('listarRentasDevueltasPorProductos → retorna solo rentas devueltas', () => {

        const rentas = [
            { id: "R1", devuelta: true },
            { id: "R2", devuelta: false }
        ];

        rentaRepoMock.buscarRentaPorProducto.mockReturnValue(rentas);

        const result = servicio.listarRentasDevueltasPorProductos("P1");

        expect(result).toEqual([{ id: "R1", devuelta: true }]);
    });

    // ---------------------------------------------------------
    // 8. calcularIngresosTotalesProductos → suma precioVenta * stock
    // ---------------------------------------------------------
    test('calcularIngresosTotalesProductos → calcula correctamente los ingresos totales', () => {

        productoRepoMock.mostrarTodo.mockReturnValue([
            { precioVenta: 100, stock: 2 }, // 200
            { precioVenta: 50, stock: 4 }   // 200
        ]);

        const total = servicio.calcularIngresosTotalesProductos();

        expect(total).toBe(400);
    });

    // ---------------------------------------------------------
    // 9. hayProductosSinStock → retorna true si algún producto no tiene stock
    // ---------------------------------------------------------
    test('hayProductosSinStock → retorna true si algún producto no tiene stock', () => {

        const productos = [
            { stock: 0 },
            { stock: 5 }
        ];

        productoRepoMock.mostrarTodo.mockReturnValue(productos);

        Validador.validarStock.mockImplementation((p) => p.stock > 0);

        const result = servicio.hayProductosSinStock();

        expect(result).toBe(true);
    });

    // ---------------------------------------------------------
    // 10. todosPreciosValidosProductos → verifica que todos los precios sean > 0
    // ---------------------------------------------------------
    test('todosPreciosValidosProductos → retorna true si todos los precios son válidos', () => {

        productoRepoMock.mostrarTodo.mockReturnValue([
            { precioVenta: 10 },
            { precioVenta: 5 }
        ]);

        const result = servicio.todosPreciosValidosProductos();

        expect(result).toBe(true);
    });

    test('todosPreciosValidosProductos → retorna false si algún precio es inválido', () => {

        productoRepoMock.mostrarTodo.mockReturnValue([
            { precioVenta: 10 },
            { precioVenta: 0 }
        ]);

        const result = servicio.todosPreciosValidosProductos();

        expect(result).toBe(false);
    });

    // ---------------------------------------------------------
    // 11. generarReporteProducto → genera reporte completo del producto
    // ---------------------------------------------------------
    test('generarReporteProducto → genera correctamente el reporte del producto', () => {

        const producto = {
            id: "P1",
            nombre: "Laptop",
            stock: 5,
            rentable: true
        };

        productoRepoMock.buscarPorId.mockReturnValue(producto);

        ventaRepoMock.buscarVentaPorProducto.mockReturnValue([{ id: "V1" }]);
        rentaRepoMock.buscarRentaPorProducto.mockReturnValue([
            { id: "R1", devuelta: true }
        ]);

        const reporte = servicio.generarReporteProducto("P1");

        expect(reporte).toEqual({
            id: "P1",
            nombre: "Laptop",
            stock: 5,
            rentable: true,
            ventas: 1,
            rentas: 1,
            devueltas: 1
        });
    });

    // ---------------------------------------------------------
    // 12. generarBalanceProductos → genera el balance general de productos
    // ---------------------------------------------------------
    test('generarBalanceProductos → genera correctamente el balance de productos', () => {

        productoRepoMock.mostrarTodo.mockReturnValue([
            { id: "P1", rentable: true, stock: 5, precioVenta: 100 },
            { id: "P2", rentable: false, stock: 0, precioVenta: 50 }
        ]);

        Validador.validarStock.mockImplementation((p) => p.stock > 0);

        const balance = servicio.generarBalanceProductos();

        expect(balance).toEqual({
            cantidadProductos: 2,
            cantidadRentables: 1,
            cantidadSinStock: 1,
            productosSinStock: 1,
            productosConPreciosValidos: 2,
            ingresosTotales: 500
        });
    });

});
