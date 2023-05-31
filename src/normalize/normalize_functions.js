const fs = require('fs');
const path = require('path');
const xlsx = require('xlsx');
const _ = require('lodash');

xlsx.set_fs(fs);

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
    return function (dados) {
        const resultado = dados.filter((elemento) => elemento.endsWith(extensao));
        return resultado;
    };
}

function definirPlanilha(indice) {
    return function (caminhos) {
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

function converterPlanilhas(planilhas) {
    return new Promise((resolve, reject) => {
        try {
            const data = planilhas.map((planilha) => xlsx.utils.sheet_to_json(planilha));
            resolve(data);
        } catch (error) {
            reject(error);
        }
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

function renomearChaves(criterio) {
    return function (dados) {
        const resultado = dados.map((array) => {
            const novoArray = array.map((objeto) => {
                const novoObjeto = Object.keys(objeto).reduce((acc, key) => {
                    if (criterio[key]) {
                        acc[criterio[key]] = objeto[key];
                    } else {
                        acc[key] = objeto[key];
                    }
                    return acc;
                }, {});
                return novoObjeto;
            });
            return novoArray;
        });
        return resultado;
    };
}

function alterarValores(callback, chavesAntigas, novaChave) {
    return function (dados) {
        const resultado = dados.map((array) => {
            const novoArray = array.map((objeto) => {
                const valores = Object.values(_.pick(objeto, chavesAntigas));
                const novoValor = callback(valores);
                const novoObjeto = _.set(objeto, novaChave, novoValor);
                return novoObjeto;
            });
            return novoArray;
        });
        return resultado;
    };
}

function mapearObjeto(criterio) {
    return function (dados) {
        const resultado = dados.map((array) => {
            const novoArray = array.map((objeto) => {
                const novoObjeto = Object.keys(objeto).reduce((acc, key) => {
                    if (criterio[key]) acc[criterio[key]] = objeto[key];
                    return acc;
                }, {});
                return novoObjeto;
            });
            return novoArray;
        });
        return resultado;
    };
}

function converterData(chave) {
    return function (dados) {
        const resultado = dados.map((array) => {
            const novoArray = array.map((objeto) => {
                const novoObjeto = Object.keys(objeto).reduce((acc, key) => {
                    if (key === chave) {
                        acc[key] = objeto[key].toISOString().slice(0, 19).replace('T', ' ');
                    } else {
                        acc[key] = objeto[key];
                    }
                    return acc;
                }, {});
                return novoObjeto;
            });
            return novoArray;
        });
        return resultado;
    };
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

module.exports = {
    alterarValores,
    convertToLowercase,
    converterData,
    converterPlanilhas,
    definirExtensao,
    definirPlanilha,
    dividirPlanilhas,
    flattenData,
    lerDiretorio,
    mapearObjeto,
    readSpreadsheets,
    removeWhitespace,
    renomearChaves
};
