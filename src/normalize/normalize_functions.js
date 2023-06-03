const _ = require('lodash');
const fs = require('fs');
const normalize_formulas = require('./normalize_formulas.js');
const path = require('path');
const xlsx = require('xlsx');

xlsx.set_fs(fs);

/**
 * Verifica a necessidade de aplicar uma função com base nos parâmetros fornecidos.
 *
 * @param {Array} param Array vazio ou um Array com os parâmetros para aplicação da função.
 * @returns {((data: Array<Object>) => Array<Object>)} Função que recebe um array de objetos e retorna
 * um array de objetos sem alteração ou com as chaves renomeadas.
 */
function changeValuesIfNeeded(param) {
    return function (data) {
        if (_.isEmpty(param)) {
            return data;
        } else {
            return changeValues(param, data);
        }
    };
}

/**
 * Aplica uma função nos valores de um objeto com base em um parâmetro fornecido.
 *
 * @param {Array} param Array com os parâmetros para aplicação da função.
 * @param {Array<Object>} data Array contendo os objetos de dados a serem processados.
 * @returns {Array<Object>} Array contendo os objetos de dados com os valores aplicados.
 */
function changeValues(param, data) {
    _.forEach(param, (param_item) => {
        const [callback_name, params, key] = param_item;
        const callback = normalize_formulas[callback_name];
        _.forEach(data, (data_item) => {
            const values = _.values(_.pick(data_item, params));
            const new_value = callback(values);
            _.set(data_item, key, new_value);
        });
    });

    return data;
}

/**
 * Converte as planilhas em formato de array para JSON.
 *
 * @param {Array<Object>} data Array contendo as planilhas para conversão.
 * @returns {Promise<Object>} Uma promise que resolve em um objeto JSON.
 */
function convertSreadsheets(data) {
    return new Promise((resolve) => {
        const result = _.map(data, (spreadsheet) => xlsx.utils.sheet_to_json(spreadsheet));
        resolve(result);
    });
}

/**
 * Converte as chaves dos objetos no array para minúsculas.
 *
 * @param {Array<Object>} data O array contendo os objetos para a conversão das chaves para minúsculas.
 * @returns {Array<Object>} O novo array de objetos com as chaves convertidas para minúsculas.
 */
function convertToLowercase(data) {
    const result = _.map(data, (item) => {
        return _.mapKeys(item, (value, key) => _.toLower(key));
    });
    return result;
}

/**
 * Verifica a necessidade de converter a data com base em um parâmetro fornecido para o formato 'YYYY-MM-DD HH:MM:SS'.
 *
 * @param {Object | Object<string, string>} param Objeto vazio ou um objeto com um par chave-valor representando
 * o valor a ser convertido.
 * @returns {((data: Array<Object>) => Array<Object>)} Função que recebe um array de objetos e retorna
 * um array de objetos sem alteração ou com o valor da data convertido.
 */
function converteDateIfNeeded(param) {
    /**
     * Retorna o objeto sem alteração ou com a data convertida.
     *
     * @param {Array<Object>} data Array contendo os objetos de dados a serem processados.
     * @returns {Array<Object>} Array contendo os objetos de dados com a data convertida.
     */
    return function (data) {
        if (_.isEmpty(param)) {
            return data;
        } else {
            return converteDate(param, data);
        }
    };
}

/**
 * Faz a conversão da data com base nos parâmetros fornecidos.
 *
 * @param {string} param String com o valor da chave para conversão da data.
 * @param {Array<Object>} data Array contendo os objetos de dados a serem processados.
 *
 * @returns {Array<Object>} Array contendo os objetos de dados com a data convertida.
 */
function converteDate(param, data) {
    return _.map(data, (item) => {
        return _.mapValues(item, (value, key) => {
            if (key === param) {
                return value.toISOString().slice(0, 19).replace('T', ' ');
            } else {
                return value;
            }
        });
    });
}

/**
 * Achata um array em um único nível, removendo aninhamentos adicionais.
 *
 * @param {Array<Array>} data O array que será achatado.
 * @returns {Array<Object>} O array achatado em um único nível.
 */
function flattenData(data) {
    const flat_data = _.flatten(data);
    return flat_data;
}

/**
 * Verifica a necessidade mapear o objeto com base em um parâmetro fornecido.
 *
 * @param {Object | Object<string, string>} param Objeto vazio ou um objeto com pares chave-valor representando
 * o mapeamento do objeto.
 * @returns {((data: Array<Object>) => Array<Object>)} Função que recebe um array de objetos e retorna
 * um array de objetos sem alteração ou com o objeto mapeado.
 */
function mapObjectIfNeeded(param) {
    /**
     * Retorna o objeto sem alteração ou com as chaves renomeadas.
     *
     * @param {Array<Object>} data Array contendo os objetos de dados a serem processados.
     * @returns {Array<Object>} Array contendo os objetos de dados mapeados
     */
    return function (data) {
        if (_.isEmpty(param)) {
            return data;
        } else {
            return mapObject(param, data);
        }
    };
}

/**
 * Faz o mapeamento do objeto com base nos parâmetros fornecidos.
 *
 * @param {Object<string, string>} param Objeto com pares chave-valor representando o mapeamento do objeto.
 * @param {Array<Object>} data Array contendo os objetos de dados a serem processados.
 *
 * * @returns {Array<Object>} Array contendo os objetos de dados mapeados.
 */
function mapObject(param, data) {
    return _.map(data, (item) => {
        return _.reduce(
            _.keys(item),
            (acc, key) => {
                if (param[key]) acc[param[key]] = item[key];
                return acc;
            },
            {}
        );
    });
}

/**
 * Converte a lista de caminhos de planilhas em uma única promise que contém as planilhas lidas.
 *
 * @param {{ paths: Array<string>; index: number; }} data Objeto com a lista de caminhos e o índice da planilha.
 * @returns {Promise<Array>} Promise que resolve em um array das planilhas lidas.
 */
function readSpreadsheets(data) {
    const { paths, index } = data;
    const result = Promise.all(_.map(paths, (path) => readSpreadsheet(path, index)));
    return result;
}

/**
 * Lê o arquivo da planilha e retorna uma promise com a planilha desejada.
 *
 * @param {string} path Caminho do arquivo da planilha para leitura.
 * @param {number} index Índice da planilha desejada.
 * @returns {Promise<Object>} Promise que resolve na planilha lida.
 */
function readSpreadsheet(path, index) {
    return new Promise((resolve) => {
        const file = xlsx.readFile(path, { cellDates: true });
        const spreadsheet = file.Sheets[file.SheetNames[index]];
        resolve(spreadsheet);
    });
}

/**
 * Remove os espaços em branco (no início e no final) das chaves dos objetos no array.
 *
 * @param {Array<Object>} data O array contendo os objetos para a remoção dos espaços em branco nas chaves.
 * @returns {Array<Object>} O novo array de objetos com as chaves alteradas, sem os espaços em branco.
 */
function removeWhitespace(data) {
    const result = _.map(data, (item) => {
        return _.mapKeys(item, (value, key) => _.trim(key));
    });
    return result;
}

/**
 * Verifica a necessidade de renomear as chaves de um objeto com base em um parâmetro fornecido.
 *
 * @param {Object | Object<string, string>} param Objeto vazio ou um objeto com pares chave-valor representando
 * as chaves e os novos nomes das chaves.
 * @returns {((data: Array<Object>) => Array<Object>)} Função que recebe um array de objetos e retorna
 * um array de objetos sem alteração ou com as chaves renomeadas.
 */
function renameKeysIfNeeded(param) {
    /**
     * Retorna o objeto sem alteração ou com as chaves renomeadas.
     *
     * @param {Array<Object>} data Array contendo os objetos de dados a serem processados.
     * @returns {Array<Object>} Array contendo os objetos de dados com as chaves renomeadas.
     */
    return function (data) {
        if (_.isEmpty(param)) {
            return data;
        } else {
            return renameKeys(param, data);
        }
    };
}

/**
 * Renomeia as chaves de um objeto com base em um parâmetro fornecido.
 *
 * @param {Object<string, string>} param Objeto com pares chave-valor representando as chaves
 * e os novos nomes das chaves.
 * @param {Array<Object>} data Array contendo os objetos de dados a serem processados.
 * @returns {Array<Object>} Array contendo os objetos de dados com as chaves renomeadas.
 */
function renameKeys(param, data) {
    const result = _.map(data, (item) => {
        return _.mapKeys(item, (value, key) => {
            if (param[key]) return param[key];
            return key;
        });
    });
    return result;
}

function lerDiretorio(caminho) {
    return new Promise((resolve, reject) => {
        try {
            const arquivos = fs.readdirSync(caminho);
            const resultado = arquivos.map((arquivo) => path.join(caminho, arquivo));
            resolve(resultado);
        } catch (error) {
            reject(error);
        }
    });
}

function definirExtensao(extensao) {
    return function (/** @type {any[]} */ dados) {
        const resultado = dados.filter((/** @type {string} */ elemento) => elemento.endsWith(extensao));
        return resultado;
    };
}

function definirPlanilha(indice) {
    return function (/** @type {any} */ caminhos) {
        const resultado = { caminhos, indice };
        return resultado;
    };
}

function dividirPlanilhas(tamanho) {
    return function ({ caminhos, indice }) {
        const resultado = [];

        for (let i = 0; i < caminhos.length; i += tamanho) {
            const pedaco = caminhos.slice(i, i + tamanho);
            resultado.push({ paths: pedaco, index: indice });
        }

        return resultado;
    };
}

module.exports = {
    changeValuesIfNeeded,
    convertSreadsheets,
    convertToLowercase,
    converteDateIfNeeded,
    definirExtensao,
    definirPlanilha,
    dividirPlanilhas,
    flattenData,
    lerDiretorio,
    mapObjectIfNeeded,
    readSpreadsheets,
    removeWhitespace,
    renameKeysIfNeeded
};
