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
const VentaRepositorio = require('./repositorios/VentaRepositorio');
const ConfigRepositorio = require('./repositorios/ConfigRepositorio');
const ItemRepositorio = require('./repositorios/ItemRepositorio');
const RentaRepositorio = require('./repositorios/RentaRepositorio');

//Exporto los servicios
const ClienteServicio = require('./servicios/ClienteServicio');
const ProductoServicio = require('./servicios/ProductoServicio');
const VentaServicio = require('./servicios/VentaServicio');
const RentaServicio = require('./servicios/RentaServicio');

//Exporto los reportes
const ClienteReporte = require('./reportes/ClienteReporte');
const ProductoReporte = require('./reportes/ProductoReporte');
const VentaReporte = require('./reportes/VentaReporte');
const RentaReporte = require('./reportes/RentaReporte');
const BalanceGeneralReporte = require('./reportes/BalanceGeneral');

//Exporto los modelos
const Rentas = require('./modelos/Renta');
const Item = require('./modelos/Item');

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
        const ventaRepo = new VentaRepositorio(datos.ventas,itemRepo);
        const configRepo = new ConfigRepositorio(datos.config);
        const itemRepo = new ItemRepositorio(datos.ventas.items);
        const rentaRepo = new RentaRepositorio(datos.rentas);

        //Inicialización de servicios
        const clienteServ = new ClienteServicio(clienteRepo,productoServ,ventaServ);
        const productoServ = new ProductoServicio(productoRepo,rentaServ);
        const ventaServ = new VentaServicio(ventaRepo,clienteRepo,productoRepo,configRepo);
        const rentaServ = new RentaServicio(rentaRepo);
        
        //Inicialización de los Reportes
        const clienteReport = new ClienteReporte(clienteRepo,ventaRepo,rentaRepo);
        const productoReport = new ProductoReporte(productoRepo,ventaRepo,rentaRepo);
        const ventaReport = new VentaReporte(ventaRepo);
        const rentaReport = new RentaReporte(rentaRepo);
        const balanceGeneralReport = new BalanceGeneralReporte(clienteRepo,productoRepo,ventaRepo,rentaRepo);
    }

    //Armar el menú
    mostrarMenu(){
        console.log("\n=== MENÚ PRINCIPAL ===");
        console.log("1.  Insertar cliente");
        console.log("2.  Insertar Producto"); 
        console.log("3.  Registrar una venta");
        console.log("4.  Registrar una renta");
        console.log("5.  Devolver Producto"); 
        console.log("6.  Listar todos los clientes");      
        console.log("7.  Listar todos los clientes activos");
        console.log("8.  Listar todos los productos");        
        console.log("9.  Alerta sobre los productos"); 
        console.log("10. Reporte: Resumen por Clientes");  
        console.log("11. Reporte: Resumen de Productos");
        console.log("12. Reporte: Resumen por Productos"); 
        console.log("13. Reporte: Resumen de Ventas");
        console.log("14. Reporte: Resumen de Ventas por fecha");  
        console.log("15. Reporte: Resumen de Ventas por periodo"); 
        console.log("16. Reporte: Resumen de Rentas");
        console.log("17. Reporte: Resumen de Rentas por fecha");  
        console.log("18. Reporte: Resumen de Rentas por periodo");       
        console.log("19. Reporte: Balance General"); 
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
                    const idprod = readLine.question("Producto ID: ");
                    const nombreProd = readLine.question("Nombre del producto: ");
                    const categoriaProd = parseInt(readLine.question("Categoría: "));
                    const precioVenta = parseFloat(readLine.question("Precio de venta: "));
                    const rentable = readLine.question("¿Es rentable? (true/false): ") === "true";
                    const stock = parseInt(readLine.question("Stock inicial: "));
                    
                    try {
                        //Registrar el servicio
                        const producto = this.productoServ.insertarProducto({
                            id: idprod,
                            nombre: nombreProd,
                            categoria: categoriaProd,
                            precioVenta,
                            rentable,
                            stock
                        });
                        console.log("Producto insertado correctamente",producto);
                    } catch (error) {
                        console.error(error.message);
                    }
                    
                    break;
        
                case "3":
                    const idClienteVenta = readLine.question("ID del cliente: ");
                    const productoVenta = readLine.question("Producto ID: ");
                    const cantidadVenta = readLine.question("Cantidad: ");
                    const precioUnitarioVenta = parseFloat(readLine.question("Precio unitario: "));
                    try {
                        //Creo una instamcia de Ventas
                        const items = new Item( 
                            productoVenta, 
                            cantidadVenta, 
                            precioUnitarioVenta 
                        )
                        const ventas = this.clienteServ.insertarVentaPorCliente(idClienteVenta,items);
                        console.log("Venta registrada correctamente",ventas);
                    } catch (error) {
                        console.error(error.message);
                    }
                    
                    break;
                
                case "4":
                    const idClienteRenta = readLine.question("ID del cliente: ");
                    const idproductoRenta = readLine.question("Producto ID: ");
                    const modeloRenta = readLine.question("Modelo de Renta: ");
                    const diasRenta = parseInt(readLine.question("Cantidad de días: "));
                    
                    try {
                        
                        //Creo la instancia
                        const rentaI = new Rentas(
                            idClienteRenta,
                            idproductoRenta,
                            modeloRenta,
                            diasRenta,
                            false           //Devuelta inicialmente en falso
                        )
                        
                        //Registrar el servicio
                        const renta = this.clienteServ.insertarRentaPorCliente(idClienteVenta,rentaI);
                        console.log("Renta registrada correctamente",renta);
                    } catch (error) {
                        console.error(error.message);
                    }
                    
                    break;

                case "5":
                    const idClienteDRenta = readLine.question("ID del cliente: ");
                    const idProductoDRenta = readLine.question("Producto ID: ");
                    
                    try {
                        const devuelto = clienteServ.devolverProductoPorCliente(idClienteDRenta,idProductoDRenta);
                        console.log("Producto devuelto correctamente",devuelto);
                    } catch (error) {
                        console.error(error.message);
                    }
                    
                    break;
                
                case "6":

                    clienteReport.listarClientes();

                    break;
                
                case "7":

                    clienteReport.listarClientesActivos();

                    break;
                
                case "8":

                    console.log("Productos: ", productoReport.mostrarDetallesProductos());

                    break;
                
                case "9":

                    console.log("¿Hay productos sin stock? ", productoReport.hayProductosSinStock());
                    console.log("¿Todos los precios son válidos? ", productoReport.todosPreciosValidosProductos());
                    console.log("Ingresos totales: ", productoReport.calcularIngresosTotalesProductos());

                    break;
                
                case "10":

                    const clienteReporteId = readLine.question("ID del cliente: ");
                    console.log("Reporte Cliente: ", clienteReport.generarReporteCliente(clienteReporteId));

                    break;
                
                case "11":

                    console.log("Resumen de Productos: ", productoReport.generarBalanceProductos());

                    break;
                
                case "12":

                    const idProductoR1 = readLine.question("Producto ID: ");

                    console.log("Resumen por Productos: ", productoReport.generarReporteProducto(idProductoR1));

                    break;
                
                case "13":

                    console.log("Total de Ventas: ", this.ventaReport.generarReporteGeneralVentas());

                    break;

                case "14":

                    const fechaISOVenta = new Date().toISOString();
                    console.log("Total de Ventas por fecha: ", this.ventaReport.totalVentasPorFecha(fechaISOVenta));

                    break;

                case "15":

                    const fechaISOVentaIni = new Date().toISOString();
                    const fechaISOVentaFin = new Date().toISOString();
                    console.log("Total de Ventas por periodo: ", this.ventaReport.totalVentasPeriodo(fechaISOVentaIni,fechaISOVentaFin));

                    break;
                
                case "16":

                    console.log("Total de Rentas: ", this.rentaReport.generarReporteGeneralRentas());

                    break;

                case "17":

                    const fechaISORenta = new Date().toISOString();
                    console.log("Total de Rentas por fecha: ", this.rentaReport.listarRentasPorFecha(fechaISOVenta));

                    break;

                case "18":

                    const fechaISORentaIni = new Date().toISOString();
                    const fechaISORentaFin = new Date().toISOString();
                    console.log("Total de Rentas por periodo: ", this.rentaReport.listarRentasPorPeriodo(fechaISOVentaIni,fechaISOVentaFin));

                    break;
                
                case "19":

                    console.log("Balance General: ", this.balanceGeneralReport.BalanceGeneral());

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
