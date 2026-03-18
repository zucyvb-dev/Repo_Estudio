/**Maneja los test unitario de la clase servicio del Cliente */
const ClienteServicio = require('../../src/servicios/ClienteServicio');
const Cliente = require('../../src/modelos/Cliente');

// Mock del Validador
jest.mock('../../src/utiles/Validador', () => ({
    validarClienteActivo: jest.fn(),
    validarTextoNoVacio: jest.fn(),
    validarEmail: jest.fn(),
    validarTelefono: jest.fn(),
    validarObjetoExistente: jest.fn(),
    validarVenta: jest.fn(),
    validarRenta: jest.fn()
}));

const Validador = require('../../src/utiles/Validador');

describe('ClienteServicio', () => {

    let clienteRepoMock;
    let productoServMock;
    let ventaServMock;
    let servicio;

    beforeEach(() => {

        clienteRepoMock = {
            insertarCliente: jest.fn(),
            buscarClientePorId: jest.fn(),
            guardarHistorialCliente: jest.fn(),
            buscarHistorialPorCliente: jest.fn(),
            obtenerHistorialPorCliente: jest.fn(),
            buscarHVentasCliente: jest.fn(),
            buscarHRentasCliente: jest.fn()
        };

        productoServMock = {
            registrarRentaProducto: jest.fn(),
            devolverProducto: jest.fn()
        };

        ventaServMock = {
            registrarVenta: jest.fn()
        };

        servicio = new ClienteServicio(
            clienteRepoMock,
            productoServMock,
            ventaServMock
        );
    });

    // ---------------------------------------------------------
    // 1. INSERTAR NUEVO CLIENTE
    // ---------------------------------------------------------
    test('insertarNuevoCliente inserta un cliente válido', () => {

        const datos = {
            id: "C001",
            nombre: "Rosy",
            activo: true,
            contacto: { email: "rosy@correo.com", telefono: "55555" }
        };

        Validador.validarClienteActivo.mockReturnValue(true);
        Validador.validarEmail.mockReturnValue(true);
        Validador.validarTelefono.mockReturnValue(true);

        clienteRepoMock.insertarCliente.mockReturnValue("OK");

        const resultado = servicio.insertarNuevoCliente(datos);

        expect(clienteRepoMock.insertarCliente).toHaveBeenCalled();
        expect(resultado).toBe("OK");
    });

    test('insertarNuevoCliente lanza error si el cliente está inactivo', () => {
        Validador.validarClienteActivo.mockReturnValue(false);

        expect(() => servicio.insertarNuevoCliente({}))
            .toThrow("Cliente inválido o inactivo");
    });

    // ---------------------------------------------------------
    // 2. INSERTAR VENTA
    // ---------------------------------------------------------
    test('insertarVentaPorCliente registra una venta correctamente', () => {

        const cliente = new Cliente("C001", "Rosy", true, {}, { ventas: [], rentas: [] });

        clienteRepoMock.buscarClientePorId.mockReturnValue(cliente);
        Validador.validarClienteActivo.mockReturnValue(true);
        Validador.validarObjetoExistente.mockReturnValue(true);
        Validador.validarVenta.mockReturnValue(true);

        ventaServMock.registrarVenta.mockReturnValue({ id: "V001" });

        const msg = servicio.insertarVentaPorCliente("C001", []);

        expect(ventaServMock.registrarVenta).toHaveBeenCalled();
        expect(clienteRepoMock.guardarHistorialCliente).toHaveBeenCalled();
        expect(msg).toContain("Se insertó satisfactoriamente");
    });

    test('insertarVentaPorCliente lanza error si el cliente no existe', () => {
        clienteRepoMock.buscarClientePorId.mockReturnValue(null);

        expect(() => servicio.insertarVentaPorCliente("C999", []))
            .toThrow("cliente no existe");
    });

    // ---------------------------------------------------------
    // 3. INSERTAR RENTA
    // ---------------------------------------------------------
    test('insertarRentaPorCliente registra una renta correctamente', () => {

        const cliente = new Cliente("C001", "Rosy", true, {}, { ventas: [], rentas: [] });

        clienteRepoMock.buscarClientePorId.mockReturnValue(cliente);
        Validador.validarClienteActivo.mockReturnValue(true);
        Validador.validarRenta.mockReturnValue(true);

        const renta = { id: "R001" };

        const msg = servicio.insertarRentaPorCliente("C001", renta);

        expect(productoServMock.registrarRentaProducto).toHaveBeenCalled();
        expect(clienteRepoMock.guardarHistorialCliente).toHaveBeenCalled();
        expect(msg).toContain("del cliente: Rosy");
    });

    test('insertarRentaPorCliente lanza error si la renta es inválida', () => {
        const cliente = new Cliente("C001", "Rosy", true, {}, {});
        clienteRepoMock.buscarClientePorId.mockReturnValue(cliente);

        Validador.validarClienteActivo.mockReturnValue(true);
        Validador.validarRenta.mockReturnValue(false);

        expect(() => servicio.insertarRentaPorCliente("C001", {}))
            .toThrow("Renta inválida");
    });

    // ---------------------------------------------------------
    // 4. DEVOLVER PRODUCTO
    // ---------------------------------------------------------
    test('devolverProductoPorCliente devuelve el mensaje correcto', () => {

        const cliente = new Cliente("C001", "Rosy", true, {}, {});

        clienteRepoMock.buscarClientePorId.mockReturnValue(cliente);
        Validador.validarClienteActivo.mockReturnValue(true);

        const result = servicio.devolverProductoPorCliente("C001", "P001");

        expect(productoServMock.devolverProducto).toHaveBeenCalled();
        expect(result.mensaje).toContain("por el cliente: Rosy");
    });

    // ---------------------------------------------------------
    // 5. OBTENER HISTORIAL
    // ---------------------------------------------------------
    test('obtenerHistorialPorCliente retorna el historial', () => {
        clienteRepoMock.buscarHistorialPorCliente.mockReturnValue({ ventas: [], rentas: [] });

        const historial = servicio.obtenerHistorialPorCliente("C001");

        expect(historial).toBeDefined();
        expect(historial.ventas).toEqual([]);
    });

    // ---------------------------------------------------------
    // 6. ACTUALIZAR EMAIL
    // ---------------------------------------------------------
    test('actualizarEmailCliente actualiza el email correctamente', () => {

        const cliente = {
            activo: true,
            contacto: { actualizarEmail: jest.fn() }
        };

        clienteRepoMock.buscarClientePorId.mockReturnValue(cliente);
        Validador.validarClienteActivo.mockReturnValue(true);
        Validador.validarEmail.mockReturnValue(true);

        const msg = servicio.actualizarEmailCliente("C001", "nuevo@mail.com");

        expect(cliente.contacto.actualizarEmail).toHaveBeenCalledWith("nuevo@mail.com");
        expect(msg).toBe("Se actualizó satisfactoriamente");
    });

    // ---------------------------------------------------------
    // 7. ACTUALIZAR TELÉFONO
    // ---------------------------------------------------------
    test('actualizarTelefonoCliente actualiza el teléfono correctamente', () => {

        const cliente = {
            activo: true,
            contacto: { actualizarTelefono: jest.fn() }
        };

        clienteRepoMock.buscarClientePorId.mockReturnValue(cliente);
        Validador.validarClienteActivo.mockReturnValue(true);
        Validador.validarTelefono.mockReturnValue(true);

        const msg = servicio.actualizarTelefonoCliente("C001", "55555");

        expect(cliente.contacto.actualizarTelefono).toHaveBeenCalledWith("55555");
        expect(msg).toBe("Se actualizó satisfactoriamente");
    });

});
