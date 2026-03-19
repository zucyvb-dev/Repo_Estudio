/**Se maneja el menú y la ejecución del proyecto, además es donde se realiza la inyección de dependencias */
const readline = require('readline-sync');

//Importar datos iniciales
const datos = require('../src/datos/Datos');

//Importar al Notificador
const Notificador = require('./utiles/Notificador');

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
const Item = require('./modelos/Item');

class App {
    constructor() {
        //Inyección de dependencias
        
        // Crear notificador central
        const notificador = new Notificador();

        // Extraer contactos e historiales de cada cliente
        // Extraer contactos e historiales de cada cliente (defensivo)
        const contactos = datos.clientes.map(c => c.contacto || {});
        const historiales = datos.clientes.map(c => c.historial || { ventas: [], rentas: [] });

        // Extraer estados y rentas de cada producto
        const estados = datos.productos.map(p => p.estado || {});
        const rentasProd = datos.productos.map(p => p.renta || {});

        // Extraer items de cada venta
        const items = Array.isArray(datos.ventas) ? datos.ventas.flatMap(v => Array.isArray(v && v.items) ? v.items : []) : [];

        //Inicialización de repositorios        
        const contactoRepo = new ContactoRepositorio(contactos);
        const historialRepo = new HistorialRepositorio(historiales);
        const clienteRepo = new ClienteRepositorio(datos.clientes,contactoRepo,historialRepo);
        const estadoRepo = new EstadoRepositorio(estados);
        const rentaProdRepo = new RentaProdRepositorio(rentasProd);
        const productoRepo = new ProductoRepositorio(datos.productos,estadoRepo,rentaProdRepo);
        const itemRepo = new ItemRepositorio(items);
        const ventaRepo = new VentaRepositorio(datos.ventas,itemRepo);
        const configRepo = new ConfigRepositorio(datos.config);
        const rentaRepo = new RentaRepositorio(datos.rentas);

        //Inicialización de servicios        
        this.ventaServ = new VentaServicio(ventaRepo,clienteRepo,productoRepo,configRepo,notificador);
        this.rentaServ = new RentaServicio(rentaRepo,notificador);
        this.productoServ = new ProductoServicio(productoRepo,this.rentaServ,notificador);
        this.clienteServ = new ClienteServicio(clienteRepo,this.productoServ,this.ventaServ,notificador);
        
        //Inicialización de los Reportes
        this.clienteReport = new ClienteReporte(clienteRepo,ventaRepo,rentaRepo);
        this.productoReport = new ProductoReporte(productoRepo,ventaRepo,rentaRepo);
        this.ventaReport = new VentaReporte(ventaRepo);
        this.rentaReport = new RentaReporte(rentaRepo);
        this.balanceGeneralReport = new BalanceGeneralReporte(clienteRepo,productoRepo,ventaRepo,rentaRepo);

        // Suscribir reportes al notificador
        notificador.suscribir(this.balanceGeneralReport);
        notificador.suscribir(this.clienteReport);
        notificador.suscribir(this.productoReport);
        notificador.suscribir(this.rentaReport);
        notificador.suscribir(this.ventaReport);

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
        console.log("14. Reporte: Resumen de Rentas");      
        console.log("15. Reporte: Balance General"); 
        console.log("0.  Salir");
    }

    //Escoger los métodos de cada opción
    run() {
        let opcion;
        do {
            this.mostrarMenu();
            opcion = readline.question("Seleccione una opcion: ");

            switch (opcion) {
                case "1":
                    const nombre = readline.question("Nombre del cliente: ");
                    const email = readline.question("Email: ");
                    const telefono = readline.question("Telefono: ");                    
                    const activo = readline.question("Activo (true/false): ") === "true";

                    try {
                        //Registrar el cliente
                        const cliente = {
                            nombre,
                            activo,
                            contacto: { email, telefono },
                            historial: { ventas: [], rentas: [] }
                        };

                        const resultCliente = this.clienteServ.insertarNuevoCliente(cliente);
                        
                        console.log("Cliente insertado correctamente: ", resultCliente);                        
                    } catch (error) {
                        console.error(error.message);                        
                    }

                    break;
                
                case "2":
                    const nombreProd = readline.question("Nombre del producto: ");
                    const categoriaProd = readline.question("Categoria: ");
                    const precioVenta = parseFloat(readline.question("Precio de venta: "));
                    const rentable = readline.question("¿Es rentable? (true/false): ") === "true";
                    const stock = parseInt(readline.question("Stock inicial: "));
                    
                    try {
                        //Registrar el producto
                        const producto = {
                            nombre: nombreProd,
                            categoria: categoriaProd,
                            precioVenta,
                            rentable,
                            stock
                        };

                        const resultProducto = this.productoServ.insertarProducto(producto);

                        console.log("Producto insertado correctamente",resultProducto);
                    } catch (error) {
                        console.error(error.message);
                    }
                    
                    break;
        
                case "3":
                    const idClienteVenta = readline.question("ID del cliente: ");
                    const productoVenta = readline.question("Producto ID: ");
                    const cantidadVenta = readline.question("Cantidad: ");
                    const precioUnitarioVenta = parseFloat(readline.question("Precio unitario: "));
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
                    const idClienteRenta = readline.question("ID del cliente: ");
                    const idproductoRenta = readline.question("Producto ID: ");
                    const modeloRenta = readline.question("Modelo de Renta (POR_DIA/LINEAL): ");
                    const diasRenta = parseInt(readline.question("Cantidad de dias: "));
                    
                    try {
                        
                        //Creo la instancia
                        const rentaI = {
                            clienteId : idClienteRenta,
                            productoId : idproductoRenta,
                            modelo : modeloRenta,
                            dias : diasRenta,
                            devuelta : false           //Devuelta inicialmente en falso
                        }
                        
                        //Registrar el servicio
                        const renta = this.clienteServ.insertarRentaPorCliente(idClienteRenta,rentaI);
                        console.log("Renta registrada correctamente",renta);
                    } catch (error) {
                        console.error(error.message);
                    }
                    
                    break;

                case "5":
                    const idClienteDRenta = readline.question("ID del cliente: ");
                    const idProductoDRenta = readline.question("Producto ID: ");
                    
                    try {
                        const devuelto = this.clienteServ.devolverProductoPorCliente(idClienteDRenta,idProductoDRenta);
                        console.log("Producto devuelto correctamente",devuelto);
                    } catch (error) {
                        console.error(error.stack);
                    }
                    
                    break;
                
                case "6":

                    console.log(this.clienteReport.listarClientes());

                    break;
                
                case "7":

                    console.log(this.clienteReport.listarClientesActivos());

                    break;
                
                case "8":

                    console.log("Productos: ", this.productoReport.mostrarDetallesProductos());

                    break;
                
                case "9":

                    console.log("¿Hay productos sin stock? ", this.productoReport.hayProductosSinStock());
                    console.log("¿Todos los precios son válidos? ", this.productoReport.todosPreciosValidosProductos());
                    console.log("Ingresos totales: ", this.productoReport.calcularIngresosTotalesProductos());

                    break;
                
                case "10":

                    const clienteReporteId = readline.question("ID del cliente: ");

                    console.log("Reporte Cliente: ", this.clienteReport.generarReporteCliente(clienteReporteId));

                    break;
                
                case "11":

                    console.log("Resumen de Productos: ", this.productoReport.generarBalanceProductos());

                    break;
                
                case "12":

                    const idProductoR1 = readline.question("Producto ID: ");

                    console.log("Resumen por Productos: ", this.productoReport.generarReporteProducto(idProductoR1));

                    break;
                
                case "13":

                    console.log("Total de Ventas: ", this.ventaReport.generarReporteGeneralVentas());

                    break;

                case "14":

                    console.log("Total de Rentas: ", this.rentaReport.generarReporteGeneralRentas());

                    break;

                case "15":

                    console.log("Balance General: ", this.balanceGeneralReport.generarBalanceGeneral());

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

//Llamada final para ejecutar la aplicación
const app = new App();
app.run();