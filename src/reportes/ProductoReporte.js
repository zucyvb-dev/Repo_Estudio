/**Maneja todos los reportes y listados de los productos */
const Validador = require('../utiles/Validador');

class ProductoReporte {
    constructor(productoRepositorio,ventaRepositorio,rentaRepositorio) {
        this.productoRepo = productoRepositorio;
        this.ventaRepo = ventaRepositorio;
        this.rentaRepo = rentaRepositorio;
    }

    //Listar todos los productos existentes
    listarProductos() {
        const productos = this.productoRepo.mostrarTodo();
        for (let i in productos) {
            const p = productos[i];
            console.log(`${p.id} - ${p.nombre} (${p.stock})`);
        }
        return productos; // <- importante
    }


    //Obtener un resumen de los productos
    obtenerResumenProducto() {
        return this.productoRepo.mostrarTodo().map(p => ({
            id: p.id,
            nombre: p.nombre,
            precio: p.precioVenta
        }));
    }

    //Mostrar más detalles de los productos
    mostrarDetallesProductos() {
        const productos = this.productoRepo.mostrarTodo();

        for (let i in productos) {
            // i es "0", "1", ...
            console.log(`${i}: ${JSON.stringify(productos[i], null, 2)}`);
        }
    }

    //Mostrar todos los productos rentables
    productosRentables() {
        return this.productoRepo.mostrarTodo().filter(p => p.rentable);
    }

    //Alertar sobre todos los productos que no tienen stock
    productorSinStock() {
        return this.productoRepo.mostrarTodo().filter(p => !Validador.validarStock(p,1));
    }

    //Listar las ventas de productos
    listarVentasPorProducto(idProducto) {
        return this.ventaRepo.buscarVentaPorProducto(idProducto);
    }

    //Listar rentas realizadas de un producto
    listarRentasPorProducto(idProducto) {
        return this.rentaRepo.buscarRentaPorProducto(idProducto);
    }

    //Listar rentas devueltas de un producto
    listarRentasDevueltasPorProductos(idProducto) {
        return this.rentaRepo.buscarRentaPorProducto(idProducto)
            .filter(r => r.devuelta);
    }

    //Calcular los Ingresos totales de los productos
    calcularIngresosTotalesProductos() {
        const productos = this.productoRepo.mostrarTodo();
        let ingresosTotales = 0;
        
        for (let i = 0; i < productos.length; i++) {
            const p = productos[i];
            ingresosTotales += (p.precioVenta || 0) * (p.stock || 0);
        }

        return ingresosTotales;
    }

    //Verifica si al menos hay algún producto sin stock, devolviendo (true/false)
    hayProductosSinStock() {
        return this.productoRepo.mostrarTodo().some(p => !Validador.validarStock(p,1));
    }

    //Muestra todos los precios válidos de los productos
    todosPreciosValidosProductos() {
        return this.productoRepo.mostrarTodo().every(p => p.precioVenta > 0);
    }

    //Reporte completo por producto
    generarReporteProducto(idProducto) {
        const producto = this.productoRepo.buscarPorId(idProducto);
        Validador.validarObjetoExistente(producto,"producto");

        return {
            id: idProducto,
            nombre: producto.nombre,
            stock: producto.stock,
            rentable: producto.rentable,
            ventas: this.listarVentasPorProducto(idProducto).length,
            rentas: this.listarRentasPorProducto(idProducto).length,
            devueltas: this.listarRentasDevueltasPorProductos(idProducto).length            
        };
    }

    generarBalanceProductos(){
        return {
            cantidadProductos: this.listarProductos().length,
            cantidadRentables: this.productosRentables().length,
            cantidadSinStock: this.productorSinStock().length,
            productosSinStock: this.hayProductosSinStock().length || 0,
            productosConPreciosValidos: this.todosPreciosValidosProductos().length || 0,
            ingresosTotales: this.calcularIngresosTotalesProductos()
        };
    }
}

module.exports = ProductoReporte;