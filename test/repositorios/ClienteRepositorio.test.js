/**Maneja los test unitarios del Repositorio de Cliente y sus clases hijas */
const ClienteRepositorio = require('../../src/repositorios/ClienteRepositorio');
const Cliente = require('../../src/modelos/Cliente');
const Contacto = require('../../src/modelos/Contacto');
const Historial = require('../../src/modelos/Historial');

describe('ClienteRepositorio', () => {
  
  let repo;
  let clienteBase;

  beforeEach(() => {
    clienteBase = new Cliente(
      'C001',
      'Rosy',
      true,
      new Contacto('rosy@example.com', '555-1234'),
      new Historial(['V001'], ['R001'])
    );
    repo = new ClienteRepositorio([clienteBase]);
  });

  test('mostrarTodo devuelve todos los clientes', () => {
    const clientes = repo.mostrarTodo();
    expect(clientes).toHaveLength(1);
    expect(clientes[0].id).toBe('C001');
  });

  test('buscarClientePorId devuelve el cliente correcto', () => {
    const cliente = repo.buscarClientePorId('C001');
    expect(cliente).toBeDefined();
    expect(cliente.nombre).toBe('Rosy');
  });

  test('insertarCliente agrega un nuevo cliente', () => {
    const nuevo = new Cliente(
      'C002',
      'Ana',
      true,
      new Contacto('ana@example.com', '555-5678'),
      new Historial([], [])
    );
    repo.insertarCliente(nuevo);
    expect(repo.mostrarTodo()).toHaveLength(2);
    expect(repo.buscarClientePorId('C002')).toBeDefined();
  });

  test('insertarCliente lanza error si el cliente ya existe', () => {
    expect(() => repo.insertarCliente(clienteBase))
      .toThrow('Ya existe ya existe ese cliente');
  });

  test('eliminarCliente elimina un cliente por id', () => {
    repo.eliminarCliente('C001');
    expect(repo.buscarClientePorId('C001')).toBeUndefined();
  });

  test('buscarPorEmail devuelve el cliente correcto', () => {
    const cliente = repo.buscarPorEmail('rosy@example.com');
    expect(cliente).toBeDefined();
    expect(cliente.id).toBe('C001');
  });

  test('buscarPorTelefono devuelve el cliente correcto', () => {
    const cliente = repo.buscarPorTelefono('555-1234');
    expect(cliente).toBeDefined();
    expect(cliente.id).toBe('C001');
  });

  test('buscarHVentasCliente devuelve true si el cliente tiene la venta', () => {
    const resultado = repo.buscarHVentasCliente('C001', 'V001');
    expect(resultado).toBe(true);
  });

  test('buscarHRentasCliente devuelve true si el cliente tiene la renta', () => {
    const resultado = repo.buscarHRentasCliente('C001', 'R001');
    expect(resultado).toBe(true);
  });

  test('guardarHistorialCliente agrega una venta', () => {
    const historial = repo.guardarHistorialCliente('C001', 'venta', 'V002');
    expect(historial.ventas).toContain('V002');
  });

  test('guardarHistorialCliente agrega una renta', () => {
    const historial = repo.guardarHistorialCliente('C001', 'renta', 'R002');
    expect(historial.rentas).toContain('R002');
  });

  test('guardarHistorialCliente lanza error si el cliente no existe', () => {
    expect(() => repo.guardarHistorialCliente('C999', 'venta', 'V003'))
      .toThrow('Cliente no encontrado');
  });

});
