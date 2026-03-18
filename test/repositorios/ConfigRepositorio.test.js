/**Maneja los test unitarios del repositorio de Config */
const ConfigRepositorio = require('../../src/repositorios/ConfigRepositorio');
const Config = require('../../src/modelos/Config');

describe('ConfigRepositorio', () => {
  
  let repo;

  beforeEach(() => {
    repo = new ConfigRepositorio({ TAX: 0.15, moneda: 'USD' });
  });

  test('mostrarTodo devuelve todas las configuraciones', () => {
    const configs = repo.mostrarTodo();
    expect(configs).toHaveLength(1);
    expect(configs[0].TAX).toBe(0.15);
    expect(configs[0].moneda).toBe('USD');
  });

  test('insertarConfig agrega una nueva configuración', () => {
    const nueva = { TAX: 0.20, moneda: 'EUR' };
    const result = repo.insertarConfig(nueva);
    expect(result.TAX).toBe(0.20);
    expect(result.moneda).toBe('EUR');
    expect(repo.mostrarTodo()).toHaveLength(2);
  });

  test('insertarConfig lanza error si la configuración ya existe', () => {
    const duplicada = { TAX: 0.15, moneda: 'USD' };
    expect(() => repo.insertarConfig(duplicada))
      .toThrow('Esa configuración ya existe en el repositorio');
  });

  test('buscarPorTAX devuelve la configuración correcta', () => {
    const config = repo.buscarPorTAX(0.15);
    expect(config).toBeDefined();
    expect(config.moneda).toBe('USD');
  });

  test('buscarPorMoneda devuelve la configuración correcta', () => {
    const config = repo.buscarPorMoneda('USD');
    expect(config).toBeDefined();
    expect(config.TAX).toBe(0.15);
  });

  test('buscarPorTAX devuelve null si no existe', () => {
    const config = repo.buscarPorTAX(0.99);
    expect(config).toBeNull();
  });

  test('buscarPorMoneda devuelve null si no existe', () => {
    const config = repo.buscarPorMoneda('MXN');
    expect(config).toBeNull();
  });

});
