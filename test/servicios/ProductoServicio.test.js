/**Maneja los test unitarios de la clase servicio del Producto */
const ProductoServicio = require('../../src/servicios/ProductoServicio');
const Producto = require('../../src/modelos/Producto');

// Mock del Validador
jest.mock('../../src/utiles/Validador', () => ({
    validarProducto: jest.fn(),
    validarTextoNoVacio: jest.fn(),
    validarProductoRentable: jest.fn(),
    validarEstadoProducto: jest.fn(),
    validarStock: jest.fn(),
    validarRenta: jest.fn()
}));

const Validador = require('../../src/utiles/Validador');

describe('ProductoServicio', () => {

    let productoRepoMock;
    let rentaServMock;
    let servicio;

    beforeEach(() => {

        productoRepoMock = {
            insertarProducto: jest.fn(),
            buscarPorId: jest.fn(),
            actualizarProducto: jest.fn()
        };

        rentaServMock = {
            registrarRenta: jest.fn(),
            devolverRenta: jest.fn(),
            rentaRepo: {
                mostrarTodo: jest.fn()
            }
        };

        servicio = new ProductoServicio(productoRepoMock, rentaServMock);
    });

    // ---------------------------------------------------------
    // 1. INSERTAR PRODUCTO
    // ---------------------------------------------------------
    test('insertarProducto inserta un producto válido', () => {

        const datos = {
            id: "P001",
            nombre: "Laptop",
            categoria: "Electrónica",
            precioVenta: 500,
            rentable: true,
            stock: 10,
            rentaProd: null
        };

        Validador.validarProducto.mockReturnValue(true);
        Validador.validarTextoNoVacio.mockReturnValue(true);

        productoRepoMock.insertarProducto.mockReturnValue("OK");

        const resultado = servicio.insertarProducto(datos);

        expect(productoRepoMock.insertarProducto).toHaveBeenCalled();
        expect(resultado).toBe("OK");
    });

    test('insertarProducto lanza error si el producto es inválido', () => {
        Validador.validarProducto.mockReturnValue(false);

        expect(() => servicio.insertarProducto({}))
            .toThrow("Producto inválido");
    });

    // ---------------------------------------------------------
    // 2. REGISTRAR RENTA
    // ---------------------------------------------------------
    test('registrarRentaProducto registra una renta correctamente', () => {

        const producto = new Producto(
            "P001", "Laptop", "Electrónica", 500, true, null, 5,
            { rentado: false, clienteId: null }
        );

        const renta = {
            productoId: "P001",
            clienteId: "C001",
            modelo: "LINEAL"
        };

        producto.precioDia = 10;
        producto.precioLineal = 50;

        productoRepoMock.buscarPorId.mockReturnValue(producto);
        Validador.validarProductoRentable.mockReturnValue(true);
        Validador.validarEstadoProducto.mockReturnValue(true);
        Validador.validarStock.mockReturnValue(true);

        const result = servicio.registrarRentaProducto(renta);

        expect(rentaServMock.registrarRenta).toHaveBeenCalled();
        expect(productoRepoMock.actualizarProducto).toHaveBeenCalled();
        expect(result.producto.estado.rentado).toBe(true);
        expect(result.producto.rentable).toBe(false);
        expect(result.producto.stock).toBe(4);
    });

    test('registrarRentaProducto lanza error si el producto no existe', () => {
        productoRepoMock.buscarPorId.mockReturnValue(null);

        expect(() => servicio.registrarRentaProducto({ productoId: "P999" }))
            .toThrow("Producto no encontrado");
    });

    // ---------------------------------------------------------
    // 3. DEVOLVER PRODUCTO
    // ---------------------------------------------------------
    test('devolverProducto devuelve el producto correctamente', () => {

        const producto = new Producto(
            "P001", "Laptop", "Electrónica", 500, false, {}, 0,
            { rentado: true, clienteId: "C001" }
        );

        const renta = [{
            clienteId: "C001",
            productoId: "P001"
        }];

        productoRepoMock.buscarPorId.mockReturnValue(producto);
        rentaServMock.rentaRepo.mostrarTodo.mockReturnValue(renta);
        Validador.validarRenta.mockReturnValue(true);

        const result = servicio.devolverProducto("C001", "P001");

        expect(rentaServMock.devolverRenta).toHaveBeenCalled();
        expect(productoRepoMock.actualizarProducto).toHaveBeenCalled();
        expect(result.producto.estado.rentado).toBe(false);
        expect(result.producto.rentable).toBe(true);
        expect(result.producto.stock).toBe(1);
    });

    test('devolverProducto lanza error si el producto no estaba rentado', () => {

        const producto = {
            estado: { rentado: false }
        };

        productoRepoMock.buscarPorId.mockReturnValue(producto);

        expect(() => servicio.devolverProducto("C001", "P001"))
            .toThrow("El producto no estaba rentado");
    });

    // ---------------------------------------------------------
    // 4. ACTUALIZAR STOCK
    // ---------------------------------------------------------
    test('actualizarStockProducto actualiza el stock correctamente', () => {

        const producto = {
            stock: 10
        };

        productoRepoMock.buscarPorId.mockReturnValue(producto);
        Validador.validarStock.mockReturnValue(true);

        productoRepoMock.actualizarProducto.mockReturnValue("OK");

        const result = servicio.actualizarStockProducto("P001", 3);

        expect(productoRepoMock.actualizarProducto).toHaveBeenCalled();
        expect(result).toBe("OK");
        expect(producto.stock).toBe(7);
    });

    test('actualizarStockProducto lanza error si el producto no existe', () => {
        productoRepoMock.buscarPorId.mockReturnValue(null);

        expect(() => servicio.actualizarStockProducto("P999", 2))
            .toThrow("Producto no encontrado");
    });

});
