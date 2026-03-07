/**Se maneja el menú y la ejecución del proyecto, además es donde se realiza la inyección de dependencias */
const readLine = require('readline');
const datos = require('../src/datos/datos');

//Exporto los repositorios
const ClienteRepositorio = require('./repositorios/ClienteRepositorio');
const ContactoRepositorio = require('./repositorios/ContactoRepositorio');
const HistorialRepositorio = require('./repositorios/HistorialRepositorio');

//Exporto los servicios
const ClienteServicio = require('./servicios/ClienteServicio');

//Exporto los modelos
const Config = require('./modelos/Config');
const Ventas = require('./modelos/Venta');
const Rentas = require('./modelos/Renta');

class name {
    constructor() {
        //Inyeccion de dependencias
        //Inicializacion de repositorios
        const clienteRepo = new ClienteRepositorio(datos.clientes);
        const contactoRepo = new ContactoRepositorio(datos.clientes.contacto);
        const historialRepo = new HistorialRepositorio(datos.clientes.historial);

        //Inicializacion de servicios
        this.clienteServ = new ClienteServicio(this.clienteRepo,this.historialRepo,this.clienteRepo);
        this.config = new Config(0.1);
    }

    //Armar el menú
    mostrarMenu(){
        console.log("\n=== MENÚ PRINCIPAL ===");
        console.log("1. Insertar cliente");
        console.log("2. Registrar una venta");
        console.log("3. Registrar una renta");
        console.log("4. Mostrar todos los clientes");
        console.log("0. Salir");
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
                        console.log("Cliente insertado: ",cliente);                        
                    } catch (error) {
                        console.error(error.message);                        
                    }

                    break;

                case "2":
                    const idClienteVenta = readLine.question("ID del cliente: ");
                    const idVenta = readLine.question("ID de la venta: "); //Momentaneo hasta que termine lo referente a la venta
                    const productoVenta = readLine.question("Producto ID: ");
                    const cantidadVenta = readLine.question("Cantidad: ");
                    const precioUnitarioVenta = parseFloat(readLine.question("Precio unitario: "));
                    const subtotalVenta = cantidadVenta * precioUnitarioVenta;
                    const taxVenta = subtotalVenta * this.config.TAX;
                    const totalVenta = subtotalVenta + taxVenta;
                    const fechaISOVenta = new Date().toISOString();

                    try {
                        //Creo una instamcia de Ventas
                        const ventasI = new Ventas(
                            idVenta,//Hasta que complete lo referente a la venta
                            idClienteVenta,
                            [
                                { productoVenta, cantidadVenta, precioUnitarioVenta }
                            ],
                            subtotalVenta,
                            taxVenta,
                            totalVenta,
                            fechaISOVenta
                        )
                        const ventas = this.clienteServ.insertarVentaPorCliente(idClienteVenta,ventasI)
                        console.log("Venta registrada correctamente",ventas);
                    } catch (error) {
                        console.error(error.message);
                    }
                    
                    break;
                
                case "3":
                    const idClienteRenta = readLine.question("ID del cliente: ");
                    const idRenta = readLine.question("ID de la renta: "); //Momentaneo hasta que termine lo referente a la renta
                    const productoRenta = readLine.question("Producto ID: ");
                    const modeloRenta = readLine.question("Modelo de Renta: ");
                    const diasRenta = parseInt(readLine.question("Cantidad de días: "));
                    const precioUnitarioRenta = parseFloat(readLine.question("Precio unitario: "));
                    const fechaISORenta = new Date().toISOString();
                    
                    try {
                        //Calcular el costo de la Renta
                        let costoRenta = 0;
                        if (modeloRenta === "POR_DIA") {
                            costoRenta = diasRenta * precioUnitarioRenta;
                        } else if (modeloRenta === "LINEAL") {
                            costoRenta = precioUnitarioRenta;
                        }

                        //Creo la instancia
                        const rentaI = new Rentas(
                            idRenta,//Hasta que complete lo referente a la renta
                            idClienteRenta,
                            productoRenta,
                            modeloRenta,
                            diasRenta,
                            costoRenta,
                            fechaISORenta,
                            false           //Devuelta inicialmente en falso
                        )
                        
                        //Registrar el servicio
                        const renta = this.clienteServ.insertarRentaPorCliente(idClienteVenta,rentaI)
                        console.log("Renta registrada correctamente",renta);
                    } catch (error) {
                        console.error(error.message);
                    }
                    
                    break;
                    
                case "4":

                    console.log("Clientes: ", this.clienteRepo.mostrarTodo());

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
