/**Maneja toda la lógica de negocio de las Rentas */
const RentaFabrica = require('../fabricas/RentaFabrica');
const Validador = require('../utiles/Validador');

class RentaServicio {
    constructor(rentaRepositorio, notificador) {
        this.rentaRepo = rentaRepositorio;
        this.notificador = notificador;
    }

    
    //Realizar el cálculo del costo de la renta según su modelo
    calcularCostoRenta(producto,dias,modelo) {
        Validador.validarObjetoExistente(producto,"producto");
        Validador.validarNumeroPositivo(dias,"dias")
        Validador.validarModeloRenta(modelo);

        if (!producto.rentaProd) {
            throw new Error("El producto no tiene configurada la información de renta");
        }

        let costo = 0;

        if (modelo === "POR_DIA") {
            if (typeof producto.rentaProd.precioDia !== "number") {
                throw new Error("El precio por día no está definido o no es numérico");
            }
            //Calculo el costo teniendo en cuenta los días
            costo = dias * Number(producto.rentaProd.precioDia);
        } else if (modelo === "LINEAL") {
            if (typeof producto.rentaProd.precioLineal !== "number") {
                throw new Error("El precio lineal no está definido o no es numérico");
            }
            //Calculo el costo teniendo en cuenta los días
            costo = Number(producto.rentaProd.precioLineal);
        } else {
            throw new Error ('Modelo de renta inválido');
        }

        //Validar el costo antes de devolverlo
        if (typeof costo !== "number" || isNaN(costo)) {
            throw new Error("El costo calculado no es válido");
        }

        return costo;
    }
    
    //Insertar una Venta
    registrarRenta(renta,producto) {
        //Validar el Objeto
        Validador.validarObjetoExistente(renta,"renta");
        
        //Validar sus atributos
        Validador.validarObjetoExistente(renta.clienteId,"clienteId");
        Validador.validarObjetoExistente(renta.productoId,"productoId");
        Validador.validarModeloRenta(renta.modelo);
        Validador.validarNumeroPositivo(renta.dias,"dias");
        //Validador.validarObjetoExistente(renta.devuelta, "devuelta")

        //Generar el ID y la fecha
        const idRenta = this.rentaRepo.generarIdRenta();
        const fechaISO = new Date().toISOString().split("T")[0];

        //Calcular el costo y asignarlo al objeto
        const costo = this.calcularCostoRenta(producto,renta.dias,renta.modelo);
        
        //Crear el objeto renta
        const nuevaRenta = RentaFabrica.crearRenta(idRenta,renta.clienteId,renta.productoId,renta.modelo,renta.dias,costo,fechaISO,renta.devuelta);
       
        //Validar nueva renta
        if (!Validador.validarRenta(nuevaRenta)) throw new Error ('Renta inválida');
    
        // Notificar a los observadores
        this.notificador.notificar("RENTA_REGISTRADA", nuevaRenta);

        return this.rentaRepo.insertarRenta(nuevaRenta);
    }

    //Devolver una renta realizada de un producto
    devolverRenta(renta) {
        //Validar el Objeto
        Validador.validarObjetoExistente(renta,"renta");

        //Marcar la renta devuelta
        renta.devuelta = true;

        // Notificar devolución
        this.notificador.notificar("RENTA_DEVUELTA", renta);


        return renta;
    }        
}

module.exports = RentaServicio;