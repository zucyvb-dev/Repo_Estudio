/**Maneja los test unitario de la creación de fábrica de Cliente*/
const ClienteFabrica = require('../../src/fabricas/ClienteFabrica');
const Cliente = require('../../src/modelos/Cliente');

describe('ClienteFabrica', () => {

    // ---------------------------------------------------------
    // 1. Crear cliente válido
    // ---------------------------------------------------------
    test('crearCliente → retorna un objeto Cliente válido', () => {
        const datos = {
            id: "C001",
            nombre: "Rosy",
            contacto: { email: "rosy@mail.com", telefono: "5555555" },
            activo: true,
            historial: { ventas: [], rentas: [] }
        };

        const cliente = ClienteFabrica.crearCliente(datos);

        expect(cliente).toBeInstanceOf(Cliente);
        expect(cliente.id).toBe("C001");
        expect(cliente.nombre).toBe("Rosy");
        expect(cliente.contacto.email).toBe("rosymail.com");
        expect(cliente.contacto.telefono).toBe("5555555");
        expect(cliente.activo).toBe(true);
        expect(cliente.historial).toEqual({ ventas: [], rentas: [] });
    });

    // ---------------------------------------------------------
    // 2. Error si falta ID
    // ---------------------------------------------------------
    test('crearCliente → lanza error si falta id', () => {
        const datos = {
            nombre: "Rosy",
            contacto: { email: "rosy@mail.com", telefono: "5555555" }
        };

        expect(() => ClienteFabrica.crearCliente(datos))
            .toThrow("id no puede estar vacío");
    });

    // ---------------------------------------------------------
    // 3. Error si falta nombre
    // ---------------------------------------------------------
    test('crearCliente → lanza error si falta nombre', () => {
        const datos = {
            id: "C001",
            contacto: { email: "rosy@mail.com", telefono: "5555555" }
        };

        expect(() => ClienteFabrica.crearCliente(datos))
            .toThrow("nombre no puede estar vacío");
    });

    // ---------------------------------------------------------
    // 4. Error si email inválido
    // ---------------------------------------------------------
    test('crearCliente → lanza error si email inválido', () => {
        const datos = {
            id: "C001",
            nombre: "Rosy",
            contacto: { email: "correo-invalido", telefono: "5555555" }
        };

        expect(() => ClienteFabrica.crearCliente(datos))
            .toThrow("Email inválido");
    });

    // ---------------------------------------------------------
    // 5. Error si teléfono inválido
    // ---------------------------------------------------------
    test('crearCliente → lanza error si teléfono inválido', () => {
        const datos = {
            id: "C001",
            nombre: "Rosy",
            contacto: { email: "rosy@mail.com", telefono: "" }
        };

        expect(() => ClienteFabrica.crearCliente(datos))
            .toThrow("Teléfono inválido");
    });

    // ---------------------------------------------------------
    // 6. Historial por defecto
    // ---------------------------------------------------------
    test('crearCliente → asigna historial vacío por defecto', () => {
        const datos = {
            id: "C001",
            nombre: "Rosy",
            contacto: { email: "rosy@mail.com", telefono: "5555555" }
        };

        const cliente = ClienteFabrica.crearCliente(datos);

        expect(cliente.historial).toEqual({ ventas: [], rentas: [] });
    });
});
