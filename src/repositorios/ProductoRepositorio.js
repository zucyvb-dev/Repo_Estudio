/**Maneja el repositorio del modelo de los productos */
const ProductoFabrica = require('../fabricas/ProductoFabrica');

class ProductoRepositorio {
    constructor(productosIniciales = [], estadoRepositorio, rentaProdRepositorio) {
        this.producto = productosIniciales.map(p => ProductoFabrica.crearProducto(p.id, p));
        this.estadoRepo = estadoRepositorio;
        this.rentaProdRepo = rentaProdRepositorio;
    }

    //Generar el IDs de producto
    generarIdProducto() {
    if (this.producto.length === 0) return "P001";
        const ultimoId = this.producto[this.producto.length - 1].id;
        const numero = parseInt(ultimoId.substring(1));
        const nuevoNumero = numero + 1;
        return "P" + nuevoNumero.toString().padStart(3, "0");
    }

    //Insertar productos
    async insertarProducto(producto) {
        /*const existe = this.buscarPorId(producto.id);
        if (existe) {
            console.warn("Aviso: ya existe un producto con este id, se actualizará de todas formas");
            existe.actualizarProducto(producto);
            return existe;        
        }*/

        this.producto.push(producto);        
        return producto;
    }

    //Actualizar productos
    async actualizarProducto(idProducto,datosProducto) {
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
    async buscarPorId(idProducto) {        
        return this.producto.find(p => p.id === idProducto);
    }
}

module.exports = ProductoRepositorio;