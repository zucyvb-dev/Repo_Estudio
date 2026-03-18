/**Maneja los test unitario del modelo de Contacto de Cliente */
const Contacto = require('../../src/modelos/Contacto');

describe('Contacto', () => {
  
  test('inicializa correctamente con valores', () => {
    const con = new Contacto('marta@example.com', '555-1234');
    expect(con.email).toBe('marta@example.com');
    expect(con.telefono).toBe('555-1234');
  });

  test('usa valores por defecto si no se pasan', () => {
    const con = new Contacto();
    expect(con.email).toBeNull();
    expect(con.telefono).toBeNull();
  });

  test('actualizarContacto cambia email y telefono', () => {
    const con = new Contacto('marta@example.com', '555-1234');
    con.actualizarContacto('ana@example.com', '555-5678');
    expect(con.email).toBe('ana@example.com');
    expect(con.telefono).toBe('555-5678');
  });

   // Caso: actualizar contacto completo
  test('actualizarContacto cambia email y telefono', () => {
    const con = new Contacto('marta@example.com', '555-1234');
    con.actualizarContacto('ana@example.com', '555-5678');
    expect(con.email).toBe('ana@example.com');
    expect(con.telefono).toBe('555-5678');
  });

  // Caso: actualizar solo email
  test('actualizarEmail cambia solo el email', () => {
    const con = new Contacto('marta@example.com', '555-1234');
    con.actualizarEmail('nuevo@example.com');
    expect(con.email).toBe('nuevo@example.com');
    expect(con.telefono).toBe('555-1234'); // se mantiene igual
  });

  // Caso: actualizar solo telefono
  test('actualizarTelefono cambia solo el telefono', () => {
    const con = new Contacto('marta@example.com', '555-1234');
    con.actualizarTelefono('555-9999');
    expect(con.telefono).toBe('555-9999');
    expect(con.email).toBe('zucel@example.com'); // se mantiene igual
  });

});
