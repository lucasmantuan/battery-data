const _ = require('lodash');
const path = require('path');

/**
 * Converte um JSON para um objeto JavaScript.
 *
 * @param {Buffer} data
 * O JSON para conversão.
 *
 * @returns {Object<*, *>}
 * O objeto JavaScript.
 */
function parseToObject(data) {
    return JSON.parse(data.toString());
}

/**
 * Retorna um array com os nomes dos arquivos a partir
 * de um array com os caminhos completos dos arquivos.
 *
 * @param {Array<string>} data
 * O array de caminhos completos dos arquivos.
 *
 * @returns {Array<string>}
 * O array com os nomes dos arquivos.
 */
function getFileName(data) {
    return _.map(data, (file_name) => path.basename(file_name));
}

module.exports = { parseToObject, getFileName };
