/**Maneja los test unitarios del repositorio de Producto y sus clases hijas */
const ProductoRepositorio = require('../../src/repositorios/ProductoRepositorio');
const Producto = require('../../src/modelos/Producto');

describe('ProductoRepositorio', () => {
  
  let repo;
  let productoBase;

  beforeEach(() => {
    productoBase = new Producto(
      'P001',
      'Laptop',
      'Electrónica',
      1000,
      true,
      null,
      10,
      'Disponible'
    );
    repo = new ProductoRepositorio([productoBase]);
  });

  test('mostrarTodo devuelve todos los productos', () => {
    const productos = repo.mostrarTodo();
    expect(productos).toHaveLength(1);
    expect(productos[0].nombre).toBe('Laptop');
  });

  test('buscarPorId devuelve el producto correcto', () => {
    const producto = repo.buscarPorId('P001');
    expect(producto).toBeDefined();
    expect(producto.nombre).toBe('Laptop');
  });

  test('insertarProducto agrega un nuevo producto', () => {
    const nuevo = new Producto(
      'P002',
      'Teléfono',
      'Electrónica',
      500,
      true,
      null,
      20,
      'Disponible'
    );
    repo.insertarProducto(nuevo);
    expect(repo.mostrarTodo()).toHaveLength(2);
    expect(repo.buscarPorId('P002')).toBeDefined();
  });

  test('insertarProducto actualiza si el producto ya existe', () => {
    const actualizado = new Producto(
      'P001',
      'Laptop Gamer',
      'Electrónica',
      1500,
      true,
      null,
      5,
      'Disponible'
    );
    const result = repo.insertarProducto(actualizado);
    expect(result.nombre).toBe('Laptop Gamer');
    expect(result.precioVenta).toBe(1500);
    expect(repo.mostrarTodo()).toHaveLength(1); // sigue siendo uno, se actualizó
  });

  test('actualizarProducto modifica un producto existente', () => {
    const result = repo.actualizarProducto('P001', { precioVenta: 1200, stock: 8 });
    expect(result.precioVenta).toBe(1200);
    expect(result.stock).toBe(8);
  });

  test('actualizarProducto lanza error si el producto no existe', () => {
    expect(() => repo.actualizarProducto('P999', { precioVenta: 200 }))
      .toThrow('Producto no encontrado');
  });

});
