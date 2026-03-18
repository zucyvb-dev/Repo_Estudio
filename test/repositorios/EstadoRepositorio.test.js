/**Maneja los test unitarios del repositorio de Estado del Producto */
const EstadoRepositorio = require('../../src/repositorios/EstadoRepositorio');
const Estado = require('../../src/modelos/Estado');

describe('EstadoRepositorio', () => {
  
  let repo;
  let estadoBase;

  beforeEach(() => {
    estadoBase = new Estado(false, 'C001');
    repo = new EstadoRepositorio([estadoBase]);
  });

  test('mostrarTodo devuelve todos los estados', () => {
    const estados = repo.mostrarTodo();
    expect(estados).toHaveLength(1);
    expect(estados[0].clienteId).toBe('C001');
    expect(estados[0].rentado).toBe(false);
  });

  test('insertarEstado agrega un nuevo estado', () => {
    const nuevo = new Estado(true, 'C002');
    repo.insertarEstado(nuevo);
    expect(repo.mostrarTodo()).toHaveLength(2);
    expect(repo.mostrarTodo()[1].clienteId).toBe('C002');
    expect(repo.mostrarTodo()[1].rentado).toBe(true);
  });

  test('actualizarEstado modifica un estado existente', () => {
    const actualizado = repo.actualizarEstado(0, true, 'C001');
    expect(actualizado.rentado).toBe(true);
    expect(actualizado.clienteId).toBe('C001');
  });

  test('actualizarEstado lanza error si el índice no existe', () => {
    expect(() => repo.actualizarEstado(99, true, 'C999'))
      .toThrow('Estado no encontrado');
  });

});
