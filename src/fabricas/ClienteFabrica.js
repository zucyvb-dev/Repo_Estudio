/**Maneja la creación de fábrica de clientes */
const Cliente = require('../modelos/Cliente');
const Validador = require('../utiles/Validador');

class ClienteFabrica {
    static crearCliente(id, datosCliente) {
        // Validaciones básicas        
        Validador.validarTextoNoVacio(String(id), "id");
        Validador.validarTextoNoVacio(datosCliente.nombre, "nombre");
        Validador.validarBooleano(datosCliente.activo, "activo");

        // Validar contacto
        if (!datosCliente.contacto) {
            throw new Error("El contacto del cliente no existe.");
        }
        Validador.validarEmail(datosCliente.contacto.email);
        Validador.validarTelefono(datosCliente.contacto.telefono, "telefono");

        // Validar historial
        if (!datosCliente.historial) {
            throw new Error("El historial del cliente no existe.");
        }
        if (!Array.isArray(datosCliente.historial.ventas)) {
            throw new Error("El historial de ventas debe ser un arreglo.");
        }
        if (!Array.isArray(datosCliente.historial.rentas)) {
            throw new Error("El historial de rentas debe ser un arreglo.");
        }

        return new Cliente(
            id,
            datosCliente.nombre,
            datosCliente.activo ?? true,
            datosCliente.contacto,
            datosCliente.historial ?? { ventas: [], rentas: [] }
        );
    }
}

module.exports = ClienteFabrica;

