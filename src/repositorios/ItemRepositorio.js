/**Maneja el repositorio del modelo de los Items de laas Ventas */
const Item = require('../modelos/Item');

class ItemRepositorio {
    constructor(itemsIniciales = []) {
        this.item = itemsIniciales.map(i => 
            new Item(i.productoId,i.cantidad,i.precioUnitario)
        );
    }

    //Insertar un nuevo Item
    insertarItem(item) {
        //Validar para evitar duplicados
        const existe = this.item.buscarItem(item.productoId,item.cantidad,item.precioUnitario);

        if (existe) {
            throw new Error("Ese ítem ya existe en el repositorio");            
        }

        //Inserto si no existe antes
        const nuevoItem = new Item(item.productoId,item.cantidad,item.precioUnitario);
        this.item.push(nuevoItem);
        return item;
    }
    
    //Mostrar todos los elementos de los Items
    mostrarTodo(){
        return this.item;
    }

    //Busqueda de Item por el idProducto
    buscarItemPorProducto(idProducto) {
        return this.item.filter(i => i.productoId === idProducto);
    }

    //Busqueda por todos los elementos del Item
    buscarItem(idProducto,cantidad,precioUnitario) {        
        return this.item.find(
            i =>
                i.productoId === idProducto &&
                i.cantidad === cantidad &&
                i.precioUnitario === precioUnitario
        );
    }
}

module.exports = ItemRepositorio;