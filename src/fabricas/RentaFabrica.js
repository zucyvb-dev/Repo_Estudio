/**Maneja la creación de fábrica de Renta */
const Renta = require('../modelos/Renta');
const Validador = require('../utiles/Validador');

class RentaFabrica {
    static crearRenta(id, clienteId, productoId, modelo, dias, costo, fechaISO, devuelta) {
        // Validaciones básicas
        Validador.validarTextoNoVacio(String(id), "id");
        Validador.validarTextoNoVacio(String(clienteId), "clienteId");
        Validador.validarTextoNoVacio(String(productoId), "productoId");
        Validador.validarModeloRenta(modelo);
        Validador.validarNumeroPositivo(dias, "dias");
        Validador.validarNumeroPositivo(costo, "costo");
        Validador.validarTextoNoVacio(String(fechaISO), "fechaISO");

        return new Renta(
            id,
            clienteId,
            productoId,
            modelo,
            dias,
            costo,
            fechaISO || new Date().toISOString().split("T")[0],
            devuelta ?? false
        );
    }
}

module.exports = RentaFabrica;
