const _ = require('lodash');
const path = require('path');
const fs = require('fs');

function ensureDirectoryExists(directory) {
    if (!fs.existsSync(directory)) {
        fs.mkdirSync(directory);
    }
}

function ensureFileExists(path, line) {
    if (!fs.existsSync(path)) {
        fs.writeFileSync(path, line, 'utf8');
    }
}

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
 * Converte um objeto JavaScript para um JSON.
 *
 * @param {Object} data
 * O objeto JavaScript para conversão.
 *
 * @returns {string}
 * O JSON.
 */
function stringifyObject(data) {
    return JSON.stringify(data);
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

module.exports = {
    ensureDirectoryExists,
    ensureFileExists,
    getFileName,
    parseToObject,
    stringifyObject
};
