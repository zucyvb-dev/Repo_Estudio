/**Maneja los test unitarios del repositorio de RentaProd */
const RentaProdRepositorio = require('../../src/repositorios/RentaProdRepositorio');
const RentaProd = require('../../src/modelos/RentaProd');

describe('RentaProdRepositorio', () => {
  
  let repo;
  let rentaBase;

  beforeEach(() => {
    rentaBase = new RentaProd('LINEAL', 10, 50);
    repo = new RentaProdRepositorio([rentaBase]);
  });

  test('mostrarTodo devuelve todas las rentas de producto', () => {
    const rentas = repo.mostrarTodo();
    expect(rentas).toHaveLength(1);
    expect(rentas[0].modelo).toBe('LINEAL');
    expect(rentas[0].precioDia).toBe(10);
    expect(rentas[0].precioLineal).toBe(50);
  });

  test('insertarRentaProd agrega una nueva renta', () => {
    const nueva = new RentaProd('DIARIO', 20, 100);
    repo.insertarRentaProd(nueva);
    expect(repo.mostrarTodo()).toHaveLength(2);
    expect(repo.mostrarTodo()[1].modelo).toBe('POR_DIA');
  });

  test('actualizarRentaProd modifica una renta existente', () => {
    const actualizado = repo.actualizarRentaProd(0, 30, 150);
    expect(actualizado.precioDia).toBe(30);
    expect(actualizado.precioLineal).toBe(150);
  });

  test('actualizarRentaProd lanza error si el índice no existe', () => {
    expect(() => repo.actualizarRentaProd(99, 40, 200))
      .toThrow('Renta del Producto no encontrada');
  });

});
