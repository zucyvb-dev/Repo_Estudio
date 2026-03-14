/**Maneja el modelo RentaProd como clase auxiliar de Producto */

class RentaProd {
    constructor(modelo,precioDia,precioLineal) {
        this.modelo = modelo;
        this.precioDia = Number.isFinite(Number(precioDia)) ? Number(precioDia) : 0;
        this.precioLineal = Number.isFinite(Number(precioLineal)) ? Number(precioLineal) : 0;
    }

    //Actualizar los precios
    actualizarPrecios(precioDia,precioLineal) {
        this.precioDia = precioDia;
        this.precioLineal = precioLineal;
    }
}

module.exports = RentaProd;