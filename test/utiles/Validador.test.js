/**Maneja los test unitarios de la clase Validador */
const Validador = require('../../src/utiles/Validador');

describe('Validador', () => {

    // ---------------------------------------------------------
    // validarClienteActivo
    // ---------------------------------------------------------
    test('validarClienteActivo → retorna true si el cliente está activo', () => {
        const cliente = { activo: true };
        expect(Validador.validarClienteActivo(cliente)).toBe(true);
    });

    test('validarClienteActivo → lanza error si el cliente no existe o está inactivo', () => {
        expect(() => Validador.validarClienteActivo(null))
            .toThrow("El estado del cliente no está activo o no existe.");
        expect(() => Validador.validarClienteActivo({ activo: false }))
            .toThrow("El estado del cliente no está activo o no existe.");
    });

    // ---------------------------------------------------------
    // validarEmail
    // ---------------------------------------------------------
    test('validarEmail → retorna true si el email es válido', () => {
        expect(Validador.validarEmail("test@mail.com")).toBe(true);
    });

    test('validarEmail → lanza error si el email es inválido', () => {
        expect(() => Validador.validarEmail("correo-invalido"))
            .toThrow("El email no tiene el formato adecuado.");
    });

    // ---------------------------------------------------------
    // validarTelefono
    // ---------------------------------------------------------
    test('validarTelefono → retorna true si el teléfono es válido', () => {
        expect(Validador.validarTelefono("5555555")).toBe(true);
    });

    test('validarTelefono → lanza error si el teléfono tiene menos de 7 dígitos', () => {
        expect(() => Validador.validarTelefono("123"))
            .toThrow("El teléfono debe tener al menos 7 dígitos.");
    });

    // ---------------------------------------------------------
    // validarVenta
    // ---------------------------------------------------------
    test('validarVenta → retorna true si la venta es válida', () => {
        const venta = { id: "V001", clienteId: "C001", items: [], total: 10 };
        expect(Validador.validarVenta(venta)).toBe(true);
    });

    test('validarVenta → lanza error si la venta es inválida', () => {
        expect(() => Validador.validarVenta({}))
            .toThrow("La venta no es válida.");
    });

    // ---------------------------------------------------------
    // validarRenta
    // ---------------------------------------------------------
    test('validarRenta → retorna true si la renta es válida', () => {
        const renta = { id: "R001", productoId: "P001", costo: 10 };
        expect(Validador.validarRenta(renta)).toBe(true);
    });

    test('validarRenta → lanza error si la renta es inválida', () => {
        expect(() => Validador.validarRenta({}))
            .toThrow("La renta no es válida.");
    });

    // ---------------------------------------------------------
    // validarProducto
    // ---------------------------------------------------------
    test('validarProducto → retorna true si el producto es válido', () => {
        const producto = { id: "P001", nombre: "Laptop", precioVenta: 10, stock: 5 };
        expect(Validador.validarProducto(producto)).toBe(true);
    });

    test('validarProducto → lanza error si el producto es inválido', () => {
        expect(() => Validador.validarProducto({}))
            .toThrow("El producto no es válido.");
    });

    // ---------------------------------------------------------
    // validarProductoRentable
    // ---------------------------------------------------------
    test('validarProductoRentable → retorna true si el producto es rentable', () => {
        expect(Validador.validarProductoRentable({ rentable: true })).toBe(true);
    });

    test('validarProductoRentable → lanza error si el producto no es rentable', () => {
        expect(() => Validador.validarProductoRentable({ rentable: false }))
            .toThrow("El producto no es rentable.");
    });

    // ---------------------------------------------------------
    // validarEstadoProducto
    // ---------------------------------------------------------
    test('validarEstadoProducto → retorna true si el producto está disponible', () => {
        const producto = { estado: "Disponible", rentable: true };
        expect(Validador.validarEstadoProducto(producto)).toBe(true);
    });

    test('validarEstadoProducto → lanza error si el producto no está disponible', () => {
        expect(() => Validador.validarEstadoProducto({ estado: "Rentado", rentable: false }))
            .toThrow("El producto no está disponible.");
    });

    // ---------------------------------------------------------
    // validarStock
    // ---------------------------------------------------------
    test('validarStock → retorna true si el producto tiene stock', () => {
        expect(Validador.validarStock({ stock: 5 })).toBe(true);
    });

    test('validarStock → lanza error si no hay stock', () => {
        expect(() => Validador.validarStock({ stock: 0 }))
            .toThrow("El producto no tiene suficiente stock.");
    });

    // ---------------------------------------------------------
    // validarPrecioVentaProducto
    // ---------------------------------------------------------
    test('validarPrecioVentaProducto → retorna true si el precio es válido', () => {
        expect(Validador.validarPrecioVentaProducto({ precioVenta: 10 })).toBe(true);
    });

    test('validarPrecioVentaProducto → lanza error si el precio es inválido', () => {
        expect(() => Validador.validarPrecioVentaProducto({ precioVenta: 0 }))
            .toThrow("El precio de venta debe ser mayor que 0.");
    });

    // ---------------------------------------------------------
    // validarTextoNoVacio
    // ---------------------------------------------------------
    test('validarTextoNoVacio → retorna true si el texto no está vacío', () => {
        expect(Validador.validarTextoNoVacio("Hola", "campo")).toBe(true);
    });

    test('validarTextoNoVacio → lanza error si el texto está vacío', () => {
        expect(() => Validador.validarTextoNoVacio("", "nombre"))
            .toThrow("El campo nombre no puede estar vacío.");
    });

    // ---------------------------------------------------------
    // validarNumeroPositivo
    // ---------------------------------------------------------
    test('validarNumeroPositivo → retorna true si el número es positivo', () => {
        expect(Validador.validarNumeroPositivo(5, "dias")).toBe(true);
    });

    test('validarNumeroPositivo → lanza error si el número es negativo o no es número', () => {
        expect(() => Validador.validarNumeroPositivo(-1, "dias"))
            .toThrow("El campo dias debe ser un número positivo.");
    });

    // ---------------------------------------------------------
    // validarObjetoExistente
    // ---------------------------------------------------------
    test('validarObjetoExistente → no lanza error si el objeto existe', () => {
        expect(() => Validador.validarObjetoExistente({ id: 1 }, "objeto")).not.toThrow();
    });

    test('validarObjetoExistente → lanza error si el objeto no existe', () => {
        expect(() => Validador.validarObjetoExistente(null, "objeto"))
            .toThrow("El objeto no existe.");
    });

    // ---------------------------------------------------------
    // validarModeloRenta
    // ---------------------------------------------------------
    test('validarModeloRenta → retorna true si el modelo es válido', () => {
        expect(Validador.validarModeloRenta("LINEAL")).toBe(true);
        expect(Validador.validarModeloRenta("POR_DIA")).toBe(true);
    });

    test('validarModeloRenta → lanza error si el modelo es inválido', () => {
        expect(() => Validador.validarModeloRenta("MENSUAL"))
            .toThrow("Modelo de renta inválido. Debe ser LINEAL o POR_DIA.");
    });

});
