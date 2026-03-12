/**Maneja el repositorio del modelo de Renta */
const Renta = require('../modelos/Renta');

class RentaRepositorio {
    constructor(rentaInicial = []) {
        this.rentas = rentaInicial.map(r =>
            new Renta(
                r.id,
                r.clienteId,
                r.productoId,
                r.modelo,
                r.dias,
                r.costo,
                r.fechaISO,
                r.devuelta
            )
        )
    }

    //Generar el id autoincremental de la Renta
    generarIdRenta() {
        if (this.rentas.length === 0) return "R001";
        const ultimoRId = this.rentas[this.rentas.length -1].id;
        const numeroR = parseInt(ultimoRId.substring(1));
        const numeroRNuevo = numeroR + 1;
        return "R" + numeroRNuevo.toString().padStart(3,"0");
    }

    //Insertar una renta
    insertarRenta(renta) {
        this.rentas.push(renta)
        return renta;
    }
    
    //Mostrar todos los elementos de las Rentas
    mostrarTodo(){
        return this.rentas;
    }
    
    //Buscar por una renta por Cliente
    buscarRentaPorCliente(clienteId) {
        return this.rentas.filter(r => r.clienteId === clienteId);
    }

    //Buscar por una renta por Producto
    buscarRentaPorProducto(idProducto) {
        return this.rentas.filter(r => r.productoId === idProducto);
    }

    //Buscar una renta por fecha
    buscarRentaPorFecha(fecha) {
        return this.rentas.filter(r => r.fechaISO === fecha);
    }

    //Buscar por id de Renta
    buscarPorIdRenta(idRenta) {
        return this.rentas.find(r => r.id === idRenta);
    }
}

module.exports = RentaRepositorio;