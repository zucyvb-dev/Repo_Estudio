/**Maneja los test unitarios del repositorio de Rentas */
const RentaRepositorio = require('../../src/repositorios/RentaRepositorio');
const Renta = require('../../src/modelos/Renta');

describe('RentaRepositorio', () => {
  
  let repo;
  let rentaBase;

  beforeEach(() => {
    rentaBase = new Renta(
      'R001',
      'C001',
      'P001',
      'LINEAL',
      5,
      250,
      '2026-03-17',
      false
    );
    repo = new RentaRepositorio([rentaBase]);
  });

  test('mostrarTodo devuelve todas las rentas', () => {
    const rentas = repo.mostrarTodo();
    expect(rentas).toHaveLength(1);
    expect(rentas[0].id).toBe('R001');
    expect(rentas[0].clienteId).toBe('C001');
  });

  test('generarIdRenta devuelve R001 si no hay rentas', () => {
    const repoVacio = new RentaRepositorio([]);
    expect(repoVacio.generarIdRenta()).toBe('R001');
  });

  test('generarIdRenta incrementa correctamente', () => {
    expect(repo.generarIdRenta()).toBe('R002');
  });

  test('insertarRenta agrega una nueva renta', () => {
    const nueva = new Renta(
      repo.generarIdRenta(),
      'C002',
      'P002',
      'POR_DIA',
      3,
      90,
      '2026-03-18',
      false
    );
    const result = repo.insertarRenta(nueva);
    expect(result.id).toBe('R002');
    expect(repo.mostrarTodo()).toHaveLength(2);
  });

  test('buscarRentaPorCliente devuelve rentas del cliente', () => {
    const rentas = repo.buscarRentaPorCliente('C001');
    expect(rentas).toHaveLength(1);
    expect(rentas[0].id).toBe('R001');
  });

  test('buscarRentaPorProducto devuelve rentas del producto', () => {
    const rentas = repo.buscarRentaPorProducto('P001');
    expect(rentas).toHaveLength(1);
    expect(rentas[0].clienteId).toBe('C001');
  });

  test('buscarRentaPorFecha devuelve rentas de la fecha', () => {
    const rentas = repo.buscarRentaPorFecha('2026-03-17');
    expect(rentas).toHaveLength(1);
    expect(rentas[0].id).toBe('R001');
  });

  test('buscarPorIdRenta devuelve la renta correcta', () => {
    const renta = repo.buscarPorIdRenta('R001');
    expect(renta).toBeDefined();
    expect(renta.productoId).toBe('P001');
  });

  test('buscarPorIdRenta devuelve undefined si no existe', () => {
    const renta = repo.buscarPorIdRenta('R999');
    expect(renta).toBeUndefined();
  });

});
