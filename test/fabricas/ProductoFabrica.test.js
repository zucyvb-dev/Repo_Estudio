/**Maneja los test unitarios de la cración de fábrica de Producto */
const ProductoFabrica = require('../../src/fabricas/ProductoFabrica');
const Producto = require('../../src/modelos/Producto');

describe('ProductoFabrica', () => {

    // ---------------------------------------------------------
    // 1. Crear producto válido
    // ---------------------------------------------------------
    test('crearProducto → retorna un objeto Producto válido', () => {
        const datos = {
            id: "P001",
            nombre: "Laptop",
            categoria: "Electrónica",
            precioVenta: 500,
            rentable: true,
            stock: 10
        };

        const producto = ProductoFabrica.crearProducto(datos);

        expect(producto).toBeInstanceOf(Producto);
        expect(producto.id).toBe("P001");
        expect(producto.nombre).toBe("Laptop");
        expect(producto.precioVenta).toBe(500);
        expect(producto.rentable).toBe(true);
        expect(producto.stock).toBe(10);
    });

    // ---------------------------------------------------------
    // 2. Error si falta ID
    // ---------------------------------------------------------
    test('crearProducto → lanza error si falta id', () => {
        const datos = {
            nombre: "Laptop",
            categoria: "Electrónica",
            precioVenta: 500,
            rentable: true,
            stock: 10
        };

        expect(() => ProductoFabrica.crearProducto(datos))
            .toThrow("id no puede estar vacío");
    });

    // ---------------------------------------------------------
    // 3. Error si falta nombre
    // ---------------------------------------------------------
    test('crearProducto → lanza error si falta nombre', () => {
        const datos = {
            id: "P001",
            categoria: "Electrónica",
            precioVenta: 500,
            rentable: true,
            stock: 10
        };

        expect(() => ProductoFabrica.crearProducto(datos))
            .toThrow("nombre no puede estar vacío");
    });

    // ---------------------------------------------------------
    // 4. Error si precioVenta no es válido
    // ---------------------------------------------------------
    test('crearProducto → lanza error si precioVenta no es numérico', () => {
        const datos = {
            id: "P001",
            nombre: "Laptop",
            categoria: "Electrónica",
            precioVenta: "no-numérico",
            rentable: true,
            stock: 10
        };

        expect(() => ProductoFabrica.crearProducto(datos))
            .toThrow("Precio de venta inválido");
    });

    // ---------------------------------------------------------
    // 5. Stock por defecto si no es numérico
    // ---------------------------------------------------------
    test('crearProducto → asigna stock 0 si no es numérico', () => {
        const datos = {
            id: "P001",
            nombre: "Laptop",
            categoria: "Electrónica",
            precioVenta: 500,
            rentable: true,
            stock: "no-numérico"
        };

        const producto = ProductoFabrica.crearProducto(datos);

        expect(producto.stock).toBe(0);
    });

    // ---------------------------------------------------------
    // 6. Rentable por defecto
    // ---------------------------------------------------------
    test('crearProducto → asigna rentable correctamente', () => {
        const datos = {
            id: "P001",
            nombre: "Laptop",
            categoria: "Electrónica",
            precioVenta: 500,
            rentable: "true",
            stock: 10
        };

        const producto = ProductoFabrica.crearProducto(datos);

        expect(producto.rentable).toBe(true);
    });
});
