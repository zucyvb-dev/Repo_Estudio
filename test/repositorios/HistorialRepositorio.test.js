/**Maneja los test unitarios del repositorio de Historial */
const HistorialRepositorio = require('../../src/repositorios/HistorialRepositorio');
const Historial = require('../../src/modelos/Historial');

describe('HistorialRepositorio', () => {
  
  let repo;
  let historialBase;

  beforeEach(() => {
    historialBase = new Historial(['V001'], ['R001']);
    repo = new HistorialRepositorio([historialBase]);
  });

  test('mostrarTodo devuelve todos los historiales', () => {
    const historiales = repo.mostrarTodo();
    expect(historiales).toHaveLength(1);
    expect(historiales[0].ventas).toContain('V001');
    expect(historiales[0].rentas).toContain('R001');
  });

  test('mostrarPorIndice devuelve el historial correcto', () => {
    const h = repo.mostrarPorIndice(0);
    expect(h.ventas).toContain('V001');
    expect(h.rentas).toContain('R001');
  });

  test('mostrarHistoriaVentas devuelve las ventas de un historial', () => {
    const ventas = repo.mostrarHistoriaVentas(historialBase);
    expect(ventas).toEqual(['V001']);
  });

  test('mostrarHistoriaRentas devuelve las rentas de un historial', () => {
    const rentas = repo.mostrarHistoriaRentas(historialBase);
    expect(rentas).toEqual(['R001']);
  });

  test('insertarHistorial agrega un historial válido', () => {
    const nuevo = new Historial(['V002'], ['R002']);
    repo.insertarHistorial(nuevo);
    expect(repo.mostrarTodo()).toHaveLength(2);
    expect(repo.mostrarPorIndice(1).ventas).toContain('V002');
  });

  test('insertarHistorial lanza error si el objeto no es instancia de Historial', () => {
    expect(() => repo.insertarHistorial({ ventas: [], rentas: [] }))
      .toThrow('Objeto no válido, debe ser un historial');
  });

});
