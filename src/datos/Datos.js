/**Datos Generales del Proyectos, no modificables */
const data = {
config: {
    TAX: 0.07,
    moneda: "USD"
},
 
clientes: [
    {
        id: "C001",
        nombre: "Ana Pérez",
        activo: true,
        contacto: { email: "ana@email.com", telefono: "555-1111" },
        historial: { ventas: [], rentas: [] }
    },
    {
        id: "C002",
        nombre: "Luis Gómez",
        activo: true,
        contacto: { email: "luis@email.com", telefono: "555-2222" },
        historial: { ventas: [], rentas: [] }
    },
    {
        id: "C003",
        nombre: "Marta Díaz",
        activo: false,
        contacto: { email: "marta@email.com", telefono: "555-3333" },
        historial: { ventas: [], rentas: [] }
    }
],
 
productos: [
    {
        id: "P001",
        nombre: "Laptop 14”",
        categoria: "electronica",
        precioVenta: 700,
        rentable: false,
        renta: null,
        stock: 4,
        estado: { rentado: false, clienteId: null }
    },
    {
        id: "P002",
        nombre: "Proyector HD",
        categoria: "electronica",
        precioVenta: 500,
        rentable: true,
        renta: { modelo: "POR_DIA", precioDia: 25, precioLineal: 120 },
        stock: 2,
        estado: { rentado: false, clienteId: null }
    },
    {
        id: "P003",
        nombre: "Cámara DSLR",
        categoria: "foto",
        precioVenta: 900,
        rentable: true,
        renta: { modelo: "LINEAL", precioDia: 40, precioLineal: 180 },
        stock: 1,
        estado: { rentado: false, clienteId: null }
    },
    {
        id: "P004",
        nombre: "Silla ergonómica",
        categoria: "oficina",
        precioVenta: 150,
        rentable: false,
        renta: null,
        stock: 6,
        estado: { rentado: false, clienteId: null }
    },
    {
        id: "P005",
        nombre: "Consola de videojuegos",
        categoria: "gaming",
        precioVenta: 400,
        rentable: true,
        renta: { modelo: "POR_DIA", precioDia: 15, precioLineal: 70 },
        stock: 3,
        estado: { rentado: false, clienteId: null }
    }
],
 
ventas: [
    {
        id: "V001",
        clienteId: "C001",
        items: [
            { productoId: "P004", cantidad: 2, precioUnitario: 150 }
        ],
        subtotal: 300,
        tax: 21,
        total: 321,
        fechaISO: "2026-02-10"
    }
],
 
rentas: [
    {
        id: "R001",
        clienteId: "C002",
        productoId: "P002",
        modelo: "POR_DIA",
        dias: 2,
        costo: 50,
        fechaISO: "2026-02-12",
        devuelta: true
    }
]
};

module.exports = data;