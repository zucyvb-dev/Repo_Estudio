/**Maneja los test unitarios del modelo Config */
const Config = require('../../src/modelos/Config');

describe('Config', () => {
  
  // Caso base: inicialización con valores válidos
  test('inicializa correctamente con valores', () => {
    const cfg = new Config(15, 'USD');
    expect(cfg.TAX).toBe(15);
    expect(cfg.moneda).toBe('USD');
  });

  // Caso: inicialización con valores por defecto (si no se pasan)
  test('inicializa con undefined si no se pasan valores', () => {
    const cfg = new Config();
    expect(cfg.TAX).toBeUndefined();
    expect(cfg.moneda).toBeUndefined();
  });

  // Caso: inicialización con valores inválidos
  test('acepta valores inválidos tal cual', () => {
    const cfg = new Config('abc', 123);
    expect(cfg.TAX).toBe('abc');   // no hay validación, se guarda tal cual
    expect(cfg.moneda).toBe(123);  // se guarda tal cual
  });

});
