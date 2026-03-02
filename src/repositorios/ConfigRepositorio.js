/**Manejo del Repositorio del Modelo Config */
//Requerimos exportar el modelo de Config
const Config = require('../modelos/Config');

class ConfigRepositorio {
    constructor(configInicial = []) {
        this.config = configInicial.map(c => new Config(c.tax,c.moneda))
    }

    //Mostrar todos los elementos de las Configuraciones
    mostrarTodo(){
        return this.config;
    }

    //Buscar por el tipo de tax
    buscarPorTAX(tax){
        return this.config(c => c.tax === tax);
    }

    
    //Buscar por el tipo de moneda
    buscarPorMoneda(moneda){
        return this.config(c => c.moneda === moneda);
    }
}

module.exports = ConfigRepositorio;