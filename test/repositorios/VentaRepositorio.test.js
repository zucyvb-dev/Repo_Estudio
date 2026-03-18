/**Maneja los test unitarios del repositorio de Ventas y de sus clases hijas */
const VentaRepositorio = require('../../src/repositorios/VentaRepositorio');
const Venta = require('../../src/modelos/Venta');
const Item = require('../../src/modelos/Item');

// Mock simple de ItemRepositorio
class ItemRepositorioMock {
  constructor() {
    this.items = [];
  }
  insertarItem(item) {
    this.items.push(item);
    return item;
  }
}

describe('VentaRepositorio', () => {
  
  let repo;
  let itemRepoMock;
  let ventaBase;

  beforeEach(() => {
    itemRepoMock = new ItemRepositorioMock();
    ventaBase = new Venta(
      'V001',
      'C001',
      [new Item('P001', 2, 100)],
      200,
      30,
      230,
      '2026-03-17'
    );
    repo = new VentaRepositorio([ventaBase], itemRepoMock);
  });

  test('mostrarTodo devuelve todas las ventas', () => {
    const ventas = repo.mostrarTodo();
    expect(ventas).toHaveLength(1);
    expect(ventas[0].id).toBe('V001');
  });

  test('generarIdVenta devuelve V001 si no hay ventas', () => {
    const repoVacio = new VentaRepositorio([], itemRepoMock);
    expect(repoVacio.generarIdVenta()).toBe('V001');
  });

  test('generarIdVenta incrementa correctamente', () => {
    expect(repo.generarIdVenta()).toBe('V002');
  });

  test('insertarVenta agrega una nueva venta y valida ítems', () => {
    const nueva = new Venta(
      repo.generarIdVenta(),
      'C002',
      [new Item('P002', 1, 50)],
      50,
      7.5,
      57.5,
      '2026-03-18'
    );
    const result = repo.insertarVenta(nueva);
    expect(result.id).toBe('V002');
    expect(repo.mostrarTodo()).toHaveLength(2);
    expect(itemRepoMock.items).toHaveLength(1); // ítem insertado en el mock
  });

  test('buscarVentaPorCliente devuelve ventas del cliente', () => {
    const ventas = repo.buscarVentaPorCliente('C001');
    expect(ventas).toHaveLength(1);
    expect(ventas[0].id).toBe('V001');
  });

  test('buscarVentaPorFecha devuelve ventas de la fecha', () => {
    const ventas = repo.buscarVentaPorFecha('2026-03-17');
    expect(ventas).toHaveLength(1);
    expect(ventas[0].id).toBe('V001');
  });

  test('buscarPorIdVenta devuelve la venta correcta', () => {
    const venta = repo.buscarPorIdVenta('V001');
    expect(venta).toBeDefined();
    expect(venta.clienteId).toBe('C001');
  });

  test('buscarVentaPorProducto actualmente devuelve vacío (productoId no está en Venta)', () => {
    const ventas = repo.buscarVentaPorProducto('P001');
    expect(ventas).toEqual([]);
  });

});
