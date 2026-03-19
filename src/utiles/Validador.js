/**Maneja las validaciones generales del proyecto */

class Validador {
    
    /**Validaciones de Cliente y de los elementos que componen sus clases hijas contacto e historial */
    //Verificar si el cliente está activo
    static validarClienteActivo(cliente) {
        if (!cliente || cliente.activo !== true) {
            throw new Error("El estado del cliente no está activo o no existe. ");            
        }
        return true;
    }

    //Verificar si el formato del email es válido
    static validarEmail(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!regex.test(email)) {
            throw new Error("El email no tiene el formato adecuado. ");
            
        }
        return regex.test(email);
    }

    //Verificar si el formato del teléfono es válido
    static validarTelefono(telefono) {
        if (typeof telefono === 'string' && telefono.replace(/\D/g, '').length < 7) {
            throw new Error("El teléfono debe tener al menos 7 dígitos. ");            
        }
        return true;
    }

    //Verificar si la venta es válida
    static validarVenta(venta) {
        if (!venta || !venta.id || !venta.clienteId || !venta.items && venta.total < 0) {
            throw new Error("La venta no es válida. ");            
        }
        return true;
    }
    
    //Verificar si la renta es válida
    static validarRenta(renta) {
        /*if (!renta || !renta.id || !renta.clienteId || !renta.productoId) {
            throw new Error("La renta no es válida.");            
        }*/
        if (Array.isArray(renta)) {
            renta = renta[0]; // o recorrer todas
        }
        if (!renta) throw new Error("La renta no es válida: objeto vacío.");
        if (!renta.id) throw new Error("La renta no es válida: falta id.");
        if (!renta.clienteId) throw new Error("La renta no es válida: falta clienteId.");
        if (!renta.productoId) throw new Error("La renta no es válida: falta productoId.");

        Validador.validarNumeroPositivo(renta.costo, "costo");

        return true;
    }


    /**Validaciones de Producto y de los elementos que componen sus clases hijas estado e rentaProd */
    //Validar los datos básicos un producto
    static validarProducto(datosProducto) {
        if (!datosProducto.nombre || !datosProducto.categoria || !this.validarPrecioVentaProducto(datosProducto) || !this.validarStock(datosProducto)) {
            throw new Error("El producto no es válido. ");            
        }
        return true;
    }

    //Validar si el producto es rentable
    static validarProductoRentable(producto) {
        if (!producto || producto.rentable !== true) {
            throw new Error("El producto no es rentable. ");            
        }
        return true;
    }

    //Validar el estado de un producto está disponible (no rentado)
    static validarEstadoProducto(producto) {
        if (!producto || producto.estado.rentado !== false || !this.validarProductoRentable(producto)) {
            throw new Error("El producto no está disponible. ");
            
        }
        return true;
    }

    //Validar si tiene stock suficiente
    static validarStock(producto) {
        if (!producto) {
            throw new Error("El producto no existe. ");            
        }
        if (producto.stock <= 0) {
            throw new Error("El producto no tiene suficiente stock. ");            
        }
        return true;
    }

    //Validar el precio de venta positivos del producto
    static validarPrecioVentaProducto(producto) {
        if (producto.precioVenta <= 0) {
            throw new Error("El precio de venta debe ser mayor que 0. ");            
        }
        return true;
    }

    //Validar que un texto no esté vacío
    static validarTextoNoVacio(valor,campo) {
        
        if (typeof valor !== "string" || valor.trim() === "") {
            throw new Error(`El campo ${campo} no puede estar vacío. `);            
        }
        return true;
    }

    //Validar que se introduzcan números positivo
    static validarNumeroPositivo(valor, campo) {
        if (valor === undefined || valor === null) {
            throw new Error(`El campo ${campo} no está definido.`);
        }
        if (typeof valor !== 'number' || isNaN(valor)) {
            throw new Error(`El campo ${campo} debe ser un número.`);
        }
        if (valor < 0) {
            throw new Error(`El campo ${campo} debe ser un número positivo.`);
        }
        return true;        
    }

    //Validar los Objetos existentes
    static validarObjetoExistente(objeto,campo) {        
        if (objeto === undefined || objeto === null) {
            throw new Error(`El ${campo} no existe.`);
        }
        
        return true;
    }

    //Validar que los modelos de Renta sean (LINEAL/POR_DIA)
    static validarModeloRenta(modelo) {
        const tipos_renta = ["LINEAL","POR_DIA"];
        if (!tipos_renta.includes(modelo)){
            throw new Error(`Modelo de renta inválido. Debe ser LINEAL o POR_DIA. `);            
        }
        return true;
    }

    //Validar los campos booleanos
    static validarBooleano(valor, campo) {
        if (typeof valor !== "boolean") {
            throw new Error(`El ${campo} debe ser un valor booleano (true/false).`);
        }
        return true;
    }
}

module.exports = Validador;
