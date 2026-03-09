/**Maneja el repositorio del modelo de Rentas de un Producto */
const RentaProd = require('../modelos/RentaProd');

class RentaProdRepositorio {
    constructor(rentaProdIniciales = []) {
        this.rentaProd = rentaProdIniciales.map(r => new RentaProd(r.modelo, r.precioDia, r.precioLineal));
    }

    //Mostrar todos los elementos de las tablas
    mostrarTodo(){
        return this.rentaProd;
    }

    //Insertar las rentas de un producto
    insertarRentaProd(rentaProd) {
        this.rentaProd.push(rentaProd);
        return rentaProd;
    }

    //Actaulizar las rentas de los productos
    actualizarRentaProd(index,precioDia,precioLineal) {
        if (!this.RentaProd[index]) throw new Error ('Renta del Producto no encontrada');
        this.RentaProd[index].actualizarPrecios(precioDia,precioLineal);
            
        return this.RentaProd[index];
    }
}