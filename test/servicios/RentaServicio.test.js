/**Maneja los test unitarios de la clase servicio de Renta */
const RentaServicio = require('../../src/servicios/RentaServicio');
const Renta = require('../../src/modelos/Renta');

// Mock del Validador
jest.mock('../../src/utiles/Validador', () => ({
    validarObjetoExistente: jest.fn(),
    validarNumeroPositivo: jest.fn(),
    validarModeloRenta: jest.fn(),
    validarRenta: jest.fn()
}));

const Validador = require('../../src/utiles/Validador');

describe('RentaServicio', () => {

    let rentaRepoMock;
    let servicio;

    beforeEach(() => {

        rentaRepoMock = {
            generarIdRenta: jest.fn(),
            insertarRenta: jest.fn()
        };

        servicio = new RentaServicio(rentaRepoMock);
    });

    // ---------------------------------------------------------
    // 1. CALCULAR COSTO DE RENTA
    // ---------------------------------------------------------

    test('calcularCostoRenta → calcula correctamente el costo POR_DIA', () => {

        const producto = {
            rentaProd: { precioDia: 10 }
        };

        Validador.validarObjetoExistente.mockReturnValue(true);
        Validador.validarNumeroPositivo.mockReturnValue(true);
        Validador.validarModeloRenta.mockReturnValue(true);

        const costo = servicio.calcularCostoRenta(producto, 3, "POR_DIA");

        expect(costo).toBe(30);
    });

    test('calcularCostoRenta → calcula correctamente el costo LINEAL', () => {

        const producto = {
            rentaProd: { precioLineal: 50 }
        };

        Validador.validarObjetoExistente.mockReturnValue(true);
        Validador.validarNumeroPositivo.mockReturnValue(true);
        Validador.validarModeloRenta.mockReturnValue(true);

        const costo = servicio.calcularCostoRenta(producto, 5, "LINEAL");

        expect(costo).toBe(50);
    });

    test('calcularCostoRenta → lanza error si el producto no tiene rentaProd', () => {

        const producto = { rentaProd: null };

        Validador.validarObjetoExistente.mockReturnValue(true);
        Validador.validarNumeroPositivo.mockReturnValue(true);
        Validador.validarModeloRenta.mockReturnValue(true);

        expect(() => servicio.calcularCostoRenta(producto, 3, "POR_DIA"))
            .toThrow("El producto no tiene configurada la información de renta");
    });

    // ---------------------------------------------------------
    // 2. REGISTRAR UNA RENTA
    // ---------------------------------------------------------

    test('registrarRenta → crea e inserta una renta correctamente', () => {

        const renta = {
            clienteId: "C001",
            productoId: "P001",
            modelo: "POR_DIA",
            dias: 3,
            devuelta: false
        };

        const producto = {
            rentaProd: { precioDia: 10 }
        };

        rentaRepoMock.generarIdRenta.mockReturnValue("R001");
        rentaRepoMock.insertarRenta.mockReturnValue("OK");

        Validador.validarObjetoExistente.mockReturnValue(true);
        Validador.validarNumeroPositivo.mockReturnValue(true);
        Validador.validarModeloRenta.mockReturnValue(true);

        const resultado = servicio.registrarRenta(renta, producto);

        expect(rentaRepoMock.generarIdRenta).toHaveBeenCalled();
        expect(rentaRepoMock.insertarRenta).toHaveBeenCalled();
        expect(resultado).toBe("OK");
    });

    test('registrarRenta → lanza error si la renta es inválida', () => {

        Validador.validarObjetoExistente.mockImplementation(() => {
            throw new Error("renta inválida");
        });

        expect(() => servicio.registrarRenta({}, {}))
            .toThrow("renta inválida");
    });

    // ---------------------------------------------------------
    // 3. DEVOLVER UNA RENTA
    // ---------------------------------------------------------

    test('devolverRenta → marca la renta como devuelta correctamente', () => {

        const renta = { devuelta: false };

        Validador.validarObjetoExistente.mockReturnValue(true);

        const result = servicio.devolverRenta(renta);

        expect(result.devuelta).toBe(true);
    });

    test('devolverRenta → lanza error si la renta no existe', () => {

        Validador.validarObjetoExistente.mockImplementation(() => {
            throw new Error("renta inválida");
        });

        expect(() => servicio.devolverRenta(null))
            .toThrow("renta inválida");
    });

});
