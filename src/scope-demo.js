/**Fichero que muestr ejemplos de scope del proyecto */

//Variable global: lista de productos iniciales
let productos = [
    {id: "P001",  nombre: "Laptop 14”", categoria: "electronica",precioVenta: 700,rentable: false,renta: null,stock: 4, estado: { rentado: false, clienteId: null }},
    {id: "P002", nombre: "Proyector HD", categoria: "electronica", precioVenta: 500, rentable: true, renta: { modelo: "POR_DIA", precioDia: 25, precioLineal: 120 },stock: 2, estado: { rentado: false, clienteId: null }}
];

//Función con variable local:obtener Ventas Por Cliente
function obtenerVentasPorCliente(clienteId) {
    const historial = this.clienteRepo.obtenerHistorialPorCliente(clienteId); //Variable Local       
    return historial ? historial.ventas : [];
}

//Bloque con variable de bloque: mensaje de devolucion
if (true) {
    let mensajeDevolucion = "Producto devuelto correctamente";
    console.log(mensajeDevolucion);    
}

//Bug por mal scope (documentado)
//Uso de var dentro de un bloque:se escapa del ámbito global
if (true) {
    var bugScope = "Soy var y me escapo del bloque";
}

console.log("Bugs: " + bugScope); //debería ser inaccesible, pero se imprime

//Correción (documentada)
//Usar variable let no se escapa
if (true) {
    let fixScope = "Soy let y me quedo en el bloque";
    console.log("Dentro del bloque corregido: ",fixScope);    
}

//console.log(fixScope); //Error: no está definida fuera del bloque

//Ejemplo con for ... in sobre un objeto Producto
let producto = {id: "P001",  nombre: "Laptop 14”", categoria: "electronica",precioVenta: 700,rentable: false,renta: null,stock: 4, estado: { rentado: false, clienteId: null }};
console.log("detalle del producto: ");
for (let atributo in producto) {
    console.log(`${atributo}: ${producto[atributo]}`); 
}
