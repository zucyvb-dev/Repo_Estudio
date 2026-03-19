/**Maneja la creación de fábrica de Ventas */

const Venta = require('../modelos/Venta');
const Item = require('../modelos/Item');
const Validador = require('../utiles/Validador');

class VentaFabrica {
    static crearVenta(id, clienteId, items, subtotal, tax, total, fechaISO) {
        // Validaciones básicas
        Validador.validarTextoNoVacio(String(id), "idVenta");
        Validador.validarTextoNoVacio(String(clienteId), "clienteId");
        Validador.validarNumeroPositivo(subtotal, "subtotal");
        Validador.validarNumeroPositivo(tax, "tax");
        Validador.validarNumeroPositivo(total, "total");
        Validador.validarTextoNoVacio(String(fechaISO), "fechaISO");

        if (!Array.isArray(items) || items.length === 0) {
            throw new Error("La venta debe tener al menos un item.");
        }

        // Validar y construir los items en un solo paso
        const itemsValidados = items.map((i, idx) => {
            Validador.validarObjetoExistente(i, `item[${idx}]`);
            Validador.validarTextoNoVacio(String(i.productoId), "productoId");
            Validador.validarNumeroPositivo(i.cantidad, "cantidad");
            Validador.validarNumeroPositivo(i.precioUnitario, "precioUnitario");
            return new Item(i.productoId, i.cantidad, i.precioUnitario);
        });

        return new Venta(
            id,
            clienteId,
            itemsValidados,
            subtotal || 0,
            tax || 0,
            total || 0,
            fechaISO || new Date().toISOString().split("T")[0]
        );
    }
}

module.exports = VentaFabrica;

