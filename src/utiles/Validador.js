/**Maneja las validaciones generales del proyecto */

class Validador {
    
    /**Validaciones de Cliente y de los elementos que componen sus clases hijas contacto e historial */
    //Verificar si el cliente está activo
    static validarClienteActivo(activo) {
        if (typeof activo !== "boolean") {
            throw new Error("El estado del cliente debe ser booleano");            
        }
        return activo === true;
    }

    //Verificar si el formato del email es válido
    static validarEmail(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    }

    //Verificar si el formato del teléfono es válido
    static validarTelefono(telefono) {
        return typeof telefono === 'string' && telefono.replace(/\D/g, '').length >= 7;
    }

    //Verificar si la venta es válida
    static validarVenta(venta) {
        return venta && venta.id && venta.productoId && venta.total >= 0;
    }
    
    //Verificar si la renta es válida
    static validarRenta(renta) {
        return renta && renta.id && renta.productoId && renta.costo >= 0;
    }
}

module.exports = Validador;
