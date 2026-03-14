# 📚 Repo_Estudio - Sistema de Ventas y Rentas

## 📌 Descripción
Este proyecto implementa un sistema de gestión de **ventas y rentas** en **JavaScript**, siguiendo una arquitectura modular y principios SOLID.  
Incluye modelos, repositorios, servicios, reportes y un archivo `scope-demo.js` para demostrar el uso de variables y ciclos.

---

## 📂 Estructura del proyecto
El repositorio está organizado de la siguiente manera:

- **src/**
  - **datos/**
    - `Datos.js` → Se encuentra los datos iniciales de los objetos del proyecto.
  - **models/**
    - `Cliente.js` → Define atributos de un cliente (id, nombre, activo,contacto,historial).
    - `Config.js` → Define atributos de una configuracion (tax, moneda).
    - `Contacto.js` → Define atributos del contacto (email, telefono) de un cliente.
    - `Estado.js` → Define atributos de un estado del producto (rentado, clienteId).
    - `Historial.js` → Define atributos de un historial (ventas,rentas) de un cliente.
    - `Item.js` → Define atributos de un item (productoId, cantidad,precioUnitario) de venta.
    - `Producto.js` → Define atributos de un producto (id, nombre, categoria,precioVenta,rentable, rentaProd,stock, estado).    
    - `Renta.js` → Representa una renta de un cliente de un producto, con costo, modelo, dias,etc.
    - `RentaProd.js` → Representa una rentaProd de un producto, con modelo, preciodias y precioLineal.
    - `Venta.js` → Representa una venta un cliente de un producto, con precio,tax,fechaISO.
  - **repositorios/**
    - `ClienteRepositorio.js` → Maneja inserción, validación y listado de clientes.
    - `ConfigRepositorio.js` → Maneja inserción, validación y listado de config.
    - `ContactoRepositorio.js` → Maneja inserción, validación y listado de contactos.
    - `EstadoRepositorio.js` → Maneja inserción, validación y listado de estado.
    - `HistorialRepositorio.js` → Maneja inserción, validación y listado de historial.
    - `ItemRepositorio.js` → Maneja inserción, validación y listado de item.
    - `ProductoRepositorio.js` → Maneja inventario, validación de stock y actualización de productos.
    - `VentaRepositorio.js` → Registra ventas y calcula totales.
    - `RentaRepositorio.js` → Registra rentas, valida stock y controla devoluciones.
    - `RentaProdRepositorio.js` → Maneja inserción, validación y listado de rentaProd.
  - **servicios/**
    - `ClienteService.js` → Lógica de negocio para clientes.
    - `ProductosService.js` → Lógica de negocio para productos.
    - `VentaService.js` → Lógica de negocio para ventas.
    - `RentaService.js` → Lógica de negocio para rentas y devoluciones.
  - **reportes/**
    - `ClienteReportes.js` → Listado descriptivo y filtrado de clientes activos.
    - `ProductoReportes.js` → Listado descriptivo y filtrado de productos disponibles.
    - `VentaReportes.js` → Reporte de ventas con totales.
    - `RentaReportes.js` → Reporte de rentas con estado activo/inactivo.
    - `BalanceGeneralReportes.js` → Balance General de ventas y rentas de los clientes y productos.
  - **utiles/**
    - `Validador.js` → Funciones de validación (duplicados, stock).
  - `app.js` → Punto de entrada con menú principal.
- **README.md** → Documentación del proyecto.
- `scope-demo.js` → Demostración de variables y ciclos.

---

## ▶️ Ejecución
## ▶️ Cómo ejecutar en consola

### Opción 1: Desde DevTools (navegador)
1. Abrir DevTools (F12 o clic derecho → "Inspeccionar").
2. Ir a la pestaña "Console".
3. Pegar el contenido de `index.js` y presionar Enter.

### Opción 2: Desde Node.js
1. Clonar el repositorio:
   ```bash
   git clone https://github.com/zucyvb-dev/Repo_Estudio.git

2. Instalar dependencias (si se aplica):
   npm install

3. Ejecutar el sistema:
   node index.js

### Opción 3: Cargar archivo en entorno local
1. Abrir tu editor (VS Code, etc.).
2. Ejecutar index.js desde terminal integrada.

---

🧠 Dónde se usaron conceptos clave
Concepto --> Ubicación / Uso destacado
Ternario --> En ClienteServicio.js para mostrar si tiene historial de venta (historial ? historial.ventas : []).
Switch --> En app.js para manejar el menú de opciones.
Reduce --> En BalanceGeneral.js para calcular el ingreso de ventas y rentas.
HOF (map, filter, forEach) --> En reportes para listar y filtrar clientes, productos y rentas
Scope-demo --> En scope-demo.js se muestra bug con var, corrección con let, y uso de for...in


---

## 📊 Ejemplos de uso
- Registrar venta
   ejecutarOpcion(3);
   // Total venta: 920
- Registrar renta
   ejecutarOpcion(4);
   // Cliente C001 rentó Laptop Lenovo
- Devolver renta
   ejecutarOpcion(5);
   // Producto devuelto correctamente, stock incrementado

---

## 🔎 Scope-demo.js
Este archivo demuestra:

    Variables globales, locales y de bloque.

    Bug de var y corrección con let.

    Uso de for...in para recorrer atributos de objetos.

    Ejemplos con map, filter, reduce, switch, for, for...of, forEach.

---

👩‍💻 Autor

Zucel  
Proyecto académico y de práctica en arquitectura modular con JavaScript.
