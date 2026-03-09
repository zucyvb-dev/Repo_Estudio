/**Maneja el repositorio del modelo de los productos */
const Producto = require('../modelos/Producto');

class ProductoRepositorio {
    constructor(productosIniciales = [], estadoRepositorio, rentaProdRepositorio) {
        this.producto = productosIniciales.map(p => new Producto(
            p.id,p.nombre,p.categoria,p.precioVenta,p.rentable,p.rentaProd,p.stock,p.estado
        ));
        this.estadoRepo = estadoRepositorio;
        this.rentaProdRepo = rentaProdRepositorio;
    }

    //Insertar productos
    insertarProducto(producto) {
        if (this.producto.some(p => p.id === producto.id)) {
            throw new Error("Ya existe ese producto");
            
        }
        this.producto.push(producto);        
        return producto;
    }

    //Actualizar productos
    actualizarProducto(idProducto,datosProducto) {
        const index = this.producto.findIndex(p => p.id === idProducto);
        if (index === -1) throw new Error ('Producto no encontrado');
        Object.assign(this.producto[index],datosProducto);
    
        return this.producto[index];
    }

    //Mostrar todos los elementos de las tablas
    mostrarTodo(){
        return this.producto;
    }

    //Buscar un producto por Id
    buscarPorId(idProducto) {
        return this.producto.find(p => p.id === idProducto);
    }
}