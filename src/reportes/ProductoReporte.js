/**Maneja todos los reportes y listados de los productos */
const Validador = require('../utiles/Validador');

class ProductoReporte {
    constructor(productoRepositorio) {
        this.productoRepo = productoRepositorio;
    }

    //Listar todos los productos existentes
    listarProductos() {
        this.productoRepo.mostrarTodo().forEach(p => {
            console.log(`${p.id} - ${p.nombre} (${p.stock})`)            
        });
    }

    //Obtener un resumen de los productos
    obtenerResumenProducto() {
        return this.productoRepo.mostrarTodo().map(p => ({
            id: p.id,
            nombre: p.nombre,
            precio: p.precioVenta
        }));
    }

    //Mostrar todos los productos rentables
    productosRentables() {
        return this.productoRepo.mostrarTodo().filter(p => p.rentable);
    }

    //Alertar sobre todos los productos que no tienen stock
    productorSinStock() {
        return this.productoRepo.mostrarTodo().filter(p => !Validador.validarStock(p,1));
    }

    //Calcular los Ingresos totales de los productos
    calcularIngresosTotalesProductos() {
        return this.productoRepo.mostrarTodo()
            .reduce((acc, p) => acc + (p.precioVenta * p.stock), 0);
    }

    //Verifica si al menos hay algún producto sin stock, devolviendo (true/false)
    hayProductosSinStock() {
        return this.productoRepo.mostrarTodo().some(p => !Validador.validarStock(p,1));
    }

    //Muestra todos los precios válidos de los productos
    todosPreciosValidosProductos() {
        return this.productoRepo.mostrarTodo().every(p => p.precioVenta > 0);
    }
}

module.exports = ProductoReporte;