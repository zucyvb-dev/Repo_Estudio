/**Maneja el modelo RentaProd como clase auxiliar de Producto */

class RentaProd {
    constructor(modelo,precioDia,precioLineal) {
        this.modelo = modelo;
        this.precioDia = precioDia;
        this.precioLineal = precioLineal;
    }

    //Actualizar los precios
    actualizarPrecios(precioDia,precioLineal) {
        this.precioDia = precioDia;
        this.precioLineal = precioLineal;
    }
}

module.exports = RentaProd;