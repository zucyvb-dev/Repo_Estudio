/**Manejo del Repositorio del Modelo Config */
//Requerimos exportar el modelo de Config
const Config = require('../modelos/Config');

class ConfigRepositorio {
    constructor(configInicial = []) {
        this.config = configInicial.map(c => new Config(c.TAX,c.moneda))
    }

    //Insertar nuevas configuraciones
    insertarConfig(configN) {
        //Validar para evitar el duplicado de configuraciones
        const existe = this.config.find(
            c => c.TAX === configN.TAX && c.moneda === configN.moneda
        );

        if (existe) {
            throw new Error("Esa configuración ya existe en el repositorio");            
        }

        const nuevaConfig = new Config(configN.TAX,configN.moneda);
        this.config.push(nuevaConfig);
        return nuevaConfig;
    }

    //Mostrar todos los elementos de las Configuraciones
    mostrarTodo(){
        return this.config;
    }

    //Buscar por el tipo de tax
    buscarPorTAX(tax){
        return this.config(c => c.TAX === tax);
    }

    
    //Buscar por el tipo de moneda
    buscarPorMoneda(moneda){
        return this.config(c => c.moneda === moneda);
    }
}

module.exports = ConfigRepositorio;