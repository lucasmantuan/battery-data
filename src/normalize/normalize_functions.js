const _ = require('lodash');
const fs = require('fs');
const normalize_formulas = require('./normalize_formulas.js');
const path = require('path');
const xlsx = require('xlsx');
const { global_parameters } = require('../utils/global_parameters.js');

xlsx.set_fs(fs);

function addValuesIfNeeded(param) {
    return function (data) {
        if (_.isEmpty(param)) {
            return data;
        } else {
            return addValues(param, data);
        }
    };
}

function addValues(param, data) {
    _.forEach(param, (param_item) => {
        const [callback_name, key] = param_item;
        const callback = normalize_formulas[callback_name];
        _.forEach(data, (data_item) => {
            const value = callback(global_parameters);
            _.set(data_item, key, value);
        });
    });
    return data;
}

/**
 * Verifica a necessidade de aplicar uma função com base nos parâmetros fornecidos.
 *
 * @param {Array | Array<Object<string, string>>} param
 * Array vazio ou um Array com os parâmetros para aplicação da função.
 *
 * @returns {((data: Array<Object>) => Array<Object>)}
 * Função que recebe um array de objetos e retorna um array de objetos sem alteração ou com as chaves renomeadas.
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
 * Aplica uma função nos valores de um objeto com base nos parâmetros fornecidos.
 *
 * @param {Array} param
 * Array com os parâmetros para aplicação da função.
 *
 * @param {Array<Object>} data
 * Array contendo os objetos de dados a serem processados.
 *
 * @returns {Array<Object>}
 * Array contendo os objetos de dados com os valores aplicados.
 */
function changeValues(param, data) {
    _.forEach(param, (param_item) => {
        const [callback_name, params, new_params, key] = param_item;
        const callback = normalize_formulas[callback_name];
        _.forEach(data, (data_item) => {
            const values = _.values(_.pick(data_item, params));
            const new_value = callback(values, new_params);
            _.set(data_item, key, new_value);
        });
    });
    return data;
}

/**
 * Converte o array das planilhas para um array de JSON.
 *
 * @param {Array<Object>} data
 * Array contendo as planilhas para conversão.
 *
 * @returns {Promise<Object>}
 * Uma promise que resolve para um array de JSON.
 */
function convertSpreadsheets(data) {
    return new Promise((resolve) => {
        const header = global_parameters.header;
        let result = [];
        if (_.isEmpty(header)) {
            result = _.map(data, (spreadsheet) => xlsx.utils.sheet_to_json(spreadsheet));
        } else {
            result = _.map(data, (spreadsheet) => xlsx.utils.sheet_to_json(spreadsheet, { header, rawNumbers: false }));
        }
        resolve(result);
    });
}

function convertTextToNumberIfNeeded(param) {
    return function (data) {
        if (_.isEmpty(param)) {
            return data;
        } else {
            return convertTextToNumber(param, data);
        }
    };
}

function convertTextToNumber(param, data) {
    const { from, to } = param;
    const result = _.map(data, (item) => {
        return _.mapValues(item, (value) => {
            const number_value = Number(value.replace(from, to));
            return isNaN(number_value) ? value : number_value;
        });
    });
    return result;
}

/**
 * Converte os nomes das chaves dos objetos para minúsculas.
 *
 * @param {Array<Object>} data
 * O array contendo os objetos para a conversão dos nomes das chaves para minúsculas.
 *
 * @returns {Array<Object>}
 * O novo array de objetos com os nomes das chaves convertidas para minúsculas.
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
 * @param {Object | Object<string, string>} param
 * Objeto vazio ou um objeto com um par chave-valor representando o valor a ser convertido.
 *
 * @returns {((data: Array<Object>) => Array<Object>)}
 * Função que recebe um array de objetos e retorna um array de objetos sem alteração ou com o valor da data convertido.
 */
function convertDateIfNeeded(param) {
    return function (data) {
        if (_.isEmpty(param)) {
            return data;
        } else {
            return converteDate(param, data);
        }
    };
}

function converteDate(param, data) {
    _.forEach(param, (param_item) => {
        _.forEach(data, (data_item) => {
            _.mapValues(data_item, (value, key) => {
                if (key === param_item && value != null) {
                    _.set(data_item, key, value.toISOString().slice(0, 19).replace('T', ' '));
                }
            });
        });
    });
    return data;
}

/**
 * Achata um array em um único nível, removendo aninhamentos adicionais.
 *
 * @param {Array<Array>} data
 * O array de arrays que será achatado.
 *
 * @returns {Array}
 * O array achatado em um único nível.
 */
function flattenData(data) {
    return _.flatten(data);
}

/**
 * Verifica a necessidade mapear o objeto com base no parâmetro fornecido.
 *
 * @param {Object | Object<string, string>} param
 * Objeto vazio ou um objeto com pares chave-valor representando o mapeamento do objeto.
 *
 * @returns {((data: Array<Object>) => Array<Object>)}
 * Função que recebe um array de objetos e retorna um array de objetos sem alteração ou com o objeto mapeado.
 */
function mapObjectIfNeeded(param) {
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
 * @param {Object<string, string>} param
 * Objeto com pares chave-valor representando o mapeamento do objeto.
 *
 * @param {Array<Object>} data
 * Array contendo os objetos de dados a serem processados.
 *
 * * @returns {Array<Object>}
 * Array contendo os objetos de dados mapeados.
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
 * Converte o array de arquivos em uma única promise que contém os arquivos processados.
 *
 * @param {Array<string>} folder_list
 * Objeto com a lista dos arquivos.
 *
 * @param {number} worksheet_number
 * Indice do arquivo para o processamento.
 *
 * @returns {Promise<Array>}
 * Promise que resolve em um array de arquivos procesados.
 */
function readSpreadsheets(folder_list, worksheet_number) {
    const result = Promise.all(_.map(folder_list, (folder) => readSpreadsheet(folder, worksheet_number)));
    return result;
}

/**
 * Lê o arquivo e retorna uma promise que resolve para o arquivo lido.
 *
 * @param {string} path
 * Caminho do arquivo para leitura.
 *
 * @param {number} index
 * Indice do arquivo para o processamento.
 *
 * @returns {Promise<Object>}
 * Promise que resolve para o arquivo lido.
 */
function readSpreadsheet(path, index) {
    return new Promise((resolve) => {
        const file = xlsx.readFile(path, { cellDates: true });
        const spreadsheet = file.Sheets[file.SheetNames[index]];
        resolve(spreadsheet);
    });
}

/**
 * Remove os espaços em branco do inicio e do final dos valores das chaves dos objetos.
 *
 * @param {Array<Object>} data
 * Array contendo os objetos para a remoção dos espaços em branco nos valores das chaves.
 *
 * @returns {Array<Object>}
 * Array de objetos com os valores das chaves sem os espaços em branco.
 */
function removeWhitespace(data) {
    const result = _.map(data, (item) => {
        return _.mapKeys(item, (value, key) => _.trim(key));
    });
    return result;
}

function removeInvalidDataIfNeeded(param) {
    return function (data) {
        if (_.isEmpty(param)) {
            return data;
        } else {
            return removeInvalidData(param, data);
        }
    };
}

function removeInvalidData(param, data) {
    const { key, type } = param;
    function isValidData(item) {
        const values = _.values(item);
        return typeof values[key] === type;
    }

    return _.filter(data, isValidData);
}

/**
 * Verifica a necessidade de renomear as chaves de um objeto com base no parâmetro fornecido.
 *
 * @param {Object | Object<string, string>} param
 * Objeto vazio ou um objeto com pares chave-valor representando as chaves e os novos nomes das chaves.
 *
 * @returns {((data: Array<Object>) => Array<Object>)}
 * Função que recebe um array de objetos e retorna um array de objetos sem alteração ou com as chaves renomeadas.
 */
function renameKeysIfNeeded(param) {
    return function (data) {
        if (_.isEmpty(param)) {
            return data;
        } else {
            return renameKeys(param, data);
        }
    };
}

/**
 * Renomeia as chaves de um objeto com base no parâmetro fornecido.
 *
 * @param {Object<string, string>} param
 * Objeto com pares chave-valor representando as chaves e os novos nomes das chaves.
 *
 * @param {Array<Object>} data
 * Array contendo os objetos de dados a serem processados.
 *
 * @returns {Array<Object>}
 * Array contendo os objetos de dados com as chaves renomeadas.
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

/**
 * Faz a leitura dos arquivos com base no caminho informado e resolve em um array contendo a lista de arquivos.
 *
 * @param {string} folder
 * String com o caminho dos arquivos.
 *
 * @returns {Promise<object>}
 * Promise que resolve em um array contendo a lista de arquivos.
 */
function readFolder(folder) {
    return new Promise((resolve) => {
        const files = fs.readdirSync(folder);
        const result = _.map(files, (file) => path.join(folder, file));
        resolve(result);
    });
}

/**
 * Filtra a lista de caminhos com base na extensão informada como parâmetro.
 *
 * @param {string} extension
 * String com a extensão para aplicação do filtro.
 *
 * @returns {((data: Array<string>) => Array<string>)}
 * Função que recebe um array de strings e retornaum array de strings com o filtro aplicado.
 */
function fileExtension(extension) {
    return function (data) {
        return data.filter((item) => item.endsWith(extension));
    };
}

/**
 * Cria um array de arrays de caminhos de arquivos com base no valor informado como parâmetro.
 *
 * @param {number} chunk
 * Tamanho do array com os caminhos dos arquivos.
 *
 * @returns {((data: Array<string>) => Array<Array<string>>)}
 * Função que recebe um array de strings e retornaum array de arrays de strings.
 */
function chunkSplit(chunk) {
    return function (params) {
        return _.chunk(params, chunk);
    };
}

module.exports = {
    addValuesIfNeeded,
    changeValuesIfNeeded,
    chunkSplit,
    convertDateIfNeeded,
    convertSpreadsheets,
    convertToLowercase,
    convertTextToNumberIfNeeded,
    fileExtension,
    flattenData,
    mapObjectIfNeeded,
    readFolder,
    readSpreadsheets,
    removeInvalidDataIfNeeded,
    removeWhitespace,
    renameKeysIfNeeded
};
