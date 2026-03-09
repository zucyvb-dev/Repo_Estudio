/**Se maneja el menú y la ejecución del proyecto, además es donde se realiza la inyección de dependencias */
const readLine = require('readline');

//Importar datos iniciales
const datos = require('../src/datos/datos');

//Exporto los repositorios
const ClienteRepositorio = require('./repositorios/ClienteRepositorio');
const ContactoRepositorio = require('./repositorios/ContactoRepositorio');
const HistorialRepositorio = require('./repositorios/HistorialRepositorio');
const ProductoRepositorio = require('./repositorios/ProductoRepositorio');
const EstadoRepositorio = require('./repositorios/EstadoRepositorio');
const RentaProdRepositorio = require('./repositorios/RentaProdRepositorio');

//Exporto los servicios
const ClienteServicio = require('./servicios/ClienteServicio');
const ProductoServicio = require('./servicios/ProductoServicio');

//Exporto los reportes
const ProductoReporte = require('./reportes/ProductoReporte');

//Exporto los modelos
const Ventas = require('./modelos/Venta');
const Rentas = require('./modelos/Renta');
const Config = require('./modelos/Config');
const { log } = require('console');

class App {
    constructor() {
        //Inyección de dependencias
        //Inicialización de repositorios        
        const contactoRepo = new ContactoRepositorio(datos.clientes.contacto);
        const historialRepo = new HistorialRepositorio(datos.clientes.historial);
        const clienteRepo = new ClienteRepositorio(datos.clientes,contactoRepo,historialRepo);
        const estadoRepo = new EstadoRepositorio(datos.productos.estado);
        const rentaProdRepo = new RentaProdRepositorio(datos.productos.renta);
        const productoRepo = new ProductoRepositorio(datos.productos,estadoRepo,rentaProdRepo);

        //Inicialización de servicios
        const clienteServ = new ClienteServicio(clienteRepo);
        const productoServ = new ProductoServicio(productoRepo);
        this.config = new Config(0.1);
        
        //Inicialización de los Reportes
        const productoReport = new ProductoReporte(productoRepo);

        //Arrays provisionales para ventas y rentas
        this.ventas = datos.ventas || [];
        this.rentas = datos.rentas || [];
    }

    //Funciones auxiliares par IDs incrementales
    generarIdVenta() {
        if (this.ventas.length === 0) return "V001";
        const ultimoVId = this.ventas[this.ventas.length -1].id;
        const numeroV = parseInt(ultimoVId.substring(1));
        const numeroVNuevo = numeroV + 1;
        return "V" + numeroVNuevo.toString().padStart(3,"0");
    }

    generarIdRenta() {
        if (this.rentas.length === 0) return "R001";
        const ultimoRId = this.rentas[this.rentas.length -1].id;
        const numeroR = parseInt(ultimoRId.substring(1));
        const numeroRNuevo = numeroR + 1;
        return "R" + numeroRNuevo.toString().padStart(3,"0");
    }

    //Armar el menú
    mostrarMenu(){
        console.log("\n=== MENÚ PRINCIPAL ===");
        console.log("1.  Insertar cliente");
        console.log("2.  Registrar una venta");
        console.log("3.  Registrar una renta");
        console.log("4.  Devolver Producto");
        console.log("5.  Insertar Producto");        
        console.log("6.  Listar todos los clientes activos");
        console.log("7.  Listar todos los productos");
        console.log("8.  Reporte: Resumen de Productos");
        console.log("9.  Reporte: Productos Rentables");
        console.log("10. Alerta sobre los productos");        
        console.log("0.  Salir");
    }

    //Escoger los métodos de cada opción
    run() {
        let opcion;
        do {
            this.mostrarMenu();
            opcion.readLine.question("Seleccione una opción: ");

            switch (opcion) {
                case "1":
                    const id = readLine.question("ID del cliente: ");
                    const nombre = readLine.question("Nombre del cliente: ");
                    const activo = readLine.question("Activo (true/false): ") === "true";
                    const email = readLine.question("Email: ");
                    const telefono = readLine.question("Telefono: ");

                    try {
                        const cliente = this.clienteServ.insertarNuevoCliente({
                            id,
                            nombre,
                            activo,
                            contacto: {email,telefono}
                        });
                        console.log("Cliente insertado correctamente: ",cliente);                        
                    } catch (error) {
                        console.error(error.message);                        
                    }

                    break;

                case "2":
                    const idClienteVenta = readLine.question("ID del cliente: ");const productoVenta = readLine.question("Producto ID: ");
                    const cantidadVenta = readLine.question("Cantidad: ");
                    const precioUnitarioVenta = parseFloat(readLine.question("Precio unitario: "));
                    const subtotalVenta = cantidadVenta * precioUnitarioVenta;
                    const taxVenta = subtotalVenta * this.config.TAX;
                    const totalVenta = subtotalVenta + taxVenta;
                    const fechaISOVenta = new Date().toISOString();

                    try {
                        //Autogenerar el id de Ventas
                        const idVentaGenerado = this.generarIdVenta();
                        //Creo una instamcia de Ventas
                        const ventasI = new Ventas(
                            idVentaGenerado,
                            idClienteVenta,
                            [
                                { productoVenta, cantidadVenta, precioUnitarioVenta }
                            ],
                            subtotalVenta,
                            taxVenta,
                            totalVenta,
                            fechaISOVenta
                        )
                        const ventas = this.clienteServ.insertarVentaPorCliente(idClienteVenta,ventasI);
                        console.log("Venta registrada correctamente",ventas);
                    } catch (error) {
                        console.error(error.message);
                    }
                    
                    break;
                
                case "3":
                    const idClienteRenta = readLine.question("ID del cliente: ");
                    const idproductoRenta = readLine.question("Producto ID: ");
                    const modeloRenta = readLine.question("Modelo de Renta: ");
                    const diasRenta = parseInt(readLine.question("Cantidad de días: "));
                    const fechaISORenta = new Date().toISOString();
                    
                    try {
                        //Autogenerar el id de Ventas
                        const idRentaGenerado = this.generarIdRenta();
                        //Calcular el costo de la Renta
                        let costoRenta = this.productoServ.calcularCostoRenta(idproductoRenta,diasRenta,modeloRenta);

                        //Creo la instancia
                        const rentaI = new Rentas(
                            idRentaGenerado,
                            idClienteRenta,
                            idproductoRenta,
                            modeloRenta,
                            diasRenta,
                            costoRenta,
                            fechaISORenta,
                            false           //Devuelta inicialmente en falso
                        )
                        
                        //Registrar el servicio
                        const renta = this.clienteServ.insertarRentaPorCliente(idClienteVenta,rentaI);
                        console.log("Renta registrada correctamente",renta);
                    } catch (error) {
                        console.error(error.message);
                    }
                    
                    break;

                case "4":
                    const productoDevuelto = readLine.question("Producto ID: ");
                    
                    try {
                        const devuelto = productoServ.devolverProducto(productoDevuelto);
                        console.log("Producto devuelto correctamente",devuelto);
                    } catch (error) {
                        console.error(error.message);
                    }
                    
                    break;
                
                case "5":
                    const idprod = readLine.question("Producto ID: ");
                    const nombreProd = readLine.question("Nombre del producto: ");
                    const categoriaProd = parseInt(readLine.question("Categoría: "));
                    const precioVenta = parseFloat(readLine.question("Precio de venta: "));
                    const rentable = readLine.question("¿Es rentable? (true/false): ") === "true";
                    const stock = parseInt(readLine.question("Stock inicial: "));
                    
                    try {
                        //Registrar el servicio
                        productoServ.insertarProducto({
                            id: idprod,
                            nombre: nombreProd,
                            categoria: categoriaProd,
                            precioVenta,
                            rentable,
                            stock
                        });
                        console.log("Producto insertado correctamente");
                    } catch (error) {
                        console.error(error.message);
                    }
                    
                    break;
        
                case "6":

                    console.log("Clientes: ", clienteServ.listarClientesActivos());

                    break;
                
                case "7":

                    console.log("Productos: ", productoReport.listarProductos());

                    break;
                
                case "8":

                    console.log("Resumen de Productos: ", productoReport.obtenerResumenProducto());

                    break;
                
                case "9":

                    console.log("Productos Rentables: ", productoReport.productosRentables());

                    break;
                
                case "10":

                    console.log("¿Hay productos sin stock? ", productoReport.hayProductosSinStock());
                    console.log("¿Todos los precios son válidos? ", productoReport.todosPreciosValidosProductos());
                    console.log("Ingresos totales: ", productoReport.calcularIngresosTotalesProductos());

                    break;
                    
                case "0":

                    console.log("Salir.");

                    break;
                        
                default:
                    console.log("Opción inválida"); 
            };

        } while (opcion !== "0");
    }

}

function preguntar(texto) {
    return new Promise(resolve => rl.question(texto, r => resolve(r)));
}
