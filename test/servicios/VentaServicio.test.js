/**Maneja los test unitarios de la clase servicio de Venta */
const VentaServicio = require('../../src/servicios/VentaServicio');
const Venta = require('../../src/modelos/Venta');

// Mock del Validador
jest.mock('../../src/utiles/Validador', () => ({
    validarClienteActivo: jest.fn(),
    validarPrecioVentaProducto: jest.fn(),
    validarStock: jest.fn()
}));

const Validador = require('../../src/utiles/Validador');

describe('VentaServicio', () => {

    let ventaRepoMock;
    let clienteRepoMock;
    let productoRepoMock;
    let configRepoMock;
    let servicio;

    beforeEach(() => {

        ventaRepoMock = {
            generarIdVenta: jest.fn(),
            insertarVenta: jest.fn()
        };

        clienteRepoMock = {
            buscarClientePorId: jest.fn()
        };

        productoRepoMock = {
            buscarPorId: jest.fn()
        };

        configRepoMock = {
            mostrarTodo: jest.fn()
        };

        servicio = new VentaServicio(
            ventaRepoMock,
            clienteRepoMock,
            productoRepoMock,
            configRepoMock
        );
    });

    // ---------------------------------------------------------
    // 1. REGISTRAR VENTA → Validación del cliente
    // ---------------------------------------------------------
    test('registrarVenta → valida correctamente el cliente', () => {

        const cliente = { activo: true };
        clienteRepoMock.buscarClientePorId.mockReturnValue(cliente);
        Validador.validarClienteActivo.mockReturnValue(true);

        productoRepoMock.buscarPorId.mockReturnValue({ stock: 10 });
        Validador.validarStock.mockReturnValue(true);
        Validador.validarPrecioVentaProducto.mockReturnValue(true);

        configRepoMock.mostrarTodo.mockReturnValue([{ TAX: 0.1 }]);
        ventaRepoMock.generarIdVenta.mockReturnValue("V001");

        const items = [
            { productoId: "P001", cantidad: 2, precioUnitario: 100 }
        ];

        const venta = servicio.registrarVenta("C001", items);

        expect(clienteRepoMock.buscarClientePorId).toHaveBeenCalledWith("C001");
        expect(venta.subtotal).toBe(200);
    });

    test('registrarVenta → lanza error si el cliente es inválido', () => {

        clienteRepoMock.buscarClientePorId.mockReturnValue(null);

        Validador.validarClienteActivo.mockImplementation(() => {
            throw new Error("Cliente inválido o inactivo");
        });

        expect(() => servicio.registrarVenta("C999", []))
            .toThrow("Cliente inválido o inactivo");
    });

    // ---------------------------------------------------------
    // 2. REGISTRAR VENTA → Validación de items
    // ---------------------------------------------------------
    test('registrarVenta → valida correctamente los items', () => {

        const cliente = { activo: true };
        clienteRepoMock.buscarClientePorId.mockReturnValue(cliente);
        Validador.validarClienteActivo.mockReturnValue(true);

        const producto = { stock: 10 };
        productoRepoMock.buscarPorId.mockReturnValue(producto);

        Validador.validarPrecioVentaProducto.mockReturnValue(true);
        Validador.validarStock.mockReturnValue(true);

        configRepoMock.mostrarTodo.mockReturnValue([{ TAX: 0.1 }]);
        ventaRepoMock.generarIdVenta.mockReturnValue("V001");

        const items = [
            { productoId: "P001", cantidad: 1, precioUnitario: 50 }
        ];

        const venta = servicio.registrarVenta("C001", items);

        expect(Validador.validarPrecioVentaProducto).toHaveBeenCalled();
        expect(Validador.validarStock).toHaveBeenCalled();
        expect(venta.subtotal).toBe(50);
    });

    // ---------------------------------------------------------
    // 3. REGISTRAR VENTA → Validación de stock insuficiente
    // ---------------------------------------------------------
    test('registrarVenta → lanza error si el stock es insuficiente', () => {

        const cliente = { activo: true };
        clienteRepoMock.buscarClientePorId.mockReturnValue(cliente);
        Validador.validarClienteActivo.mockReturnValue(true);

        productoRepoMock.buscarPorId.mockReturnValue({ stock: 0 });

        Validador.validarPrecioVentaProducto.mockReturnValue(true);
        Validador.validarStock.mockImplementation(() => {
            throw new Error("Stock insuficiente");
        });

        const items = [
            { productoId: "P001", cantidad: 1, precioUnitario: 50 }
        ];

        expect(() => servicio.registrarVenta("C001", items))
            .toThrow("Stock insuficiente");
    });

    // ---------------------------------------------------------
    // 4. REGISTRAR VENTA → Validación de configuración activa
    // ---------------------------------------------------------
    test('registrarVenta → lanza error si no hay configuración activa', () => {

        const cliente = { activo: true };
        clienteRepoMock.buscarClientePorId.mockReturnValue(cliente);
        Validador.validarClienteActivo.mockReturnValue(true);

        productoRepoMock.buscarPorId.mockReturnValue({ stock: 10 });
        Validador.validarPrecioVentaProducto.mockReturnValue(true);
        Validador.validarStock.mockReturnValue(true);

        configRepoMock.mostrarTodo.mockReturnValue([]);

        const items = [
            { productoId: "P001", cantidad: 1, precioUnitario: 50 }
        ];

        expect(() => servicio.registrarVenta("C001", items))
            .toThrow("No hay configuración activa (TAX, moneda, etc.)");
    });

    // ---------------------------------------------------------
    // 5. REGISTRAR VENTA → Cálculo de subtotal, tax y total
    // ---------------------------------------------------------
    test('registrarVenta → calcula correctamente subtotal, tax y total', () => {

        const cliente = { activo: true };
        clienteRepoMock.buscarClientePorId.mockReturnValue(cliente);
        Validador.validarClienteActivo.mockReturnValue(true);

        productoRepoMock.buscarPorId.mockReturnValue({ stock: 10 });
        Validador.validarPrecioVentaProducto.mockReturnValue(true);
        Validador.validarStock.mockReturnValue(true);

        configRepoMock.mostrarTodo.mockReturnValue([{ TAX: 0.2 }]);
        ventaRepoMock.generarIdVenta.mockReturnValue("V001");

        const items = [
            { productoId: "P001", cantidad: 2, precioUnitario: 100 }
        ];

        const venta = servicio.registrarVenta("C001", items);

        expect(venta.subtotal).toBe(200);
        expect(venta.tax).toBe(40);
        expect(venta.total).toBe(240);
    });

    // ---------------------------------------------------------
    // 6. REGISTRAR VENTA → Inserción en el repositorio
    // ---------------------------------------------------------
    test('registrarVenta → inserta la venta en el repositorio', () => {

        const cliente = { activo: true };
        clienteRepoMock.buscarClientePorId.mockReturnValue(cliente);
        Validador.validarClienteActivo.mockReturnValue(true);

        productoRepoMock.buscarPorId.mockReturnValue({ stock: 10 });
        Validador.validarPrecioVentaProducto.mockReturnValue(true);
        Validador.validarStock.mockReturnValue(true);

        configRepoMock.mostrarTodo.mockReturnValue([{ TAX: 0.1 }]);
        ventaRepoMock.generarIdVenta.mockReturnValue("V001");

        const items = [
            { productoId: "P001", cantidad: 1, precioUnitario: 50 }
        ];

        const venta = servicio.registrarVenta("C001", items);

        expect(ventaRepoMock.insertarVenta).toHaveBeenCalledWith(venta);
    });

});

