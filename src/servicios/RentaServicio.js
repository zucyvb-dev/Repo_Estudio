/**Maneja toda la lógica de negocio de las Rentas */
const Renta = require('../modelos/Renta');
const Validador = require('../utiles/Validador');

class RentaServicio {
    constructor(rentaRepositorio) {
        this.rentaRepo = rentaRepositorio;
    }

    
    //Realizar el cálculo del costo de la renta según su modelo
    calcularCostoRenta(producto,dias,modelo) {
        Validador.validarObjetoExistente(producto,"producto");
        Validador.validarNumeroPositivo(dias,"dias")
        Validador.validarModeloRenta(modelo);

        let costo = 0;

        if (modelo === "POR_DIA") {
            //Calculo el costo teniendo en cuenta los días
            costo = dias * producto.rentaProd.precioDia;
        } else if (modelo === "LINEAL") {
            //Calculo el costo teniendo en cuenta los días
            costo = producto.rentaProd.precioLineal;
        } else {
            throw new Error ('Modelo de renta inválido');
        }
        
        return costo;
    }
    
    //Insertar una Venta
    registrarRenta(renta) {
        //Validar el Objeto
        Validador.validarObjetoExistente(renta,"renta");

        //Validar sus atributos
        Validador.validarObjetoExistente(renta.clienteId,"clienteId");
        Validador.validarObjetoExistente(renta.productoId,"productoId");
        Validador.validarModeloRenta(renta.modelo);
        Validador.validarNumeroPositivo(renta.dias,"dias");
        Validador.validarObjetoExistente(renta.devuelta, "devuelta")

        //Generar el ID y la fecha
        const idRenta = this.rentaRepo.generarIdRenta();
        const fechaISO = new Date().toISOString().split("T")[0];

        //Calcular el costo y asignarlo al objeto
        const costo = this.calcularCostoRenta(renta.productoId,renta.dias,renta.modelo);
        
        //Crear el objeto renta
        const nuevaRenta = new Venta(idRenta,clienteId,productoId,modelo,dias,costo,fechaISO,devuelta);
        
        return this.rentaRepo.insertarRenta(nuevaRenta);
    }

    //Devolver una renta realizada de un producto
    devolverRenta(renta) {
        //Validar el Objeto
        Validador.validarObjetoExistente(renta,"renta");

        //Marcar la renta devuelta
        renta.devuelta = true;

        return renta;
    }
        
}