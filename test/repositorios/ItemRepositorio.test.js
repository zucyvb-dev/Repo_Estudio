/**Maneja los test unitarios del repositorio de Item de Ventas */
const ItemRepositorio = require('../../src/repositorios/ItemRepositorio');
const Item = require('../../src/modelos/Item');

describe('ItemRepositorio', () => {
  
  let repo;
  let itemBase;

  beforeEach(() => {
    itemBase = new Item('P001', 2, 100);
    repo = new ItemRepositorio([itemBase]);
  });

  test('mostrarTodo devuelve todos los ítems', () => {
    const items = repo.mostrarTodo();
    expect(items).toHaveLength(1);
    expect(items[0].productoId).toBe('P001');
    expect(items[0].cantidad).toBe(2);
    expect(items[0].precioUnitario).toBe(100);
  });

  test('insertarItem agrega un nuevo ítem', () => {
    const nuevo = new Item('P002', 1, 50);
    const result = repo.insertarItem(nuevo);
    expect(result.productoId).toBe('P002');
    expect(repo.mostrarTodo()).toHaveLength(2);
  });

  test('insertarItem lanza error si el ítem ya existe', () => {
    const duplicado = new Item('P001', 2, 100);
    expect(() => repo.insertarItem(duplicado))
      .toThrow('Ese ítem ya existe en el repositorio');
  });

  test('buscarItemPorProducto devuelve ítems del producto', () => {
    const items = repo.buscarItemPorProducto('P001');
    expect(items).toHaveLength(1);
    expect(items[0].cantidad).toBe(2);
  });

  test('buscarItem devuelve el ítem correcto', () => {
    const item = repo.buscarItem('P001', 2, 100);
    expect(item).toBeDefined();
    expect(item.productoId).toBe('P001');
  });

  test('buscarItem devuelve undefined si no existe', () => {
    const item = repo.buscarItem('P999', 1, 10);
    expect(item).toBeUndefined();
  });

});
