const _ = require('lodash');
const fs = require('fs');
const path = require('path');
// const { global_parameters } = require('../utils/global_parameters');

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

function recordLog(value) {
    // const { file_name, profile, recorded_at } = global_parameters;
    // const lower_file_name = file_name[0].toLowerCase();
    // const time_recorded_at = recorded_at.toTimeString().slice(0, 8);

    // const records = Array.isArray(value)
    //     ? value.length
    //     : value instanceof Error
    //     ? value.message
    //     : value.records;

    // const step = Array.isArray(value) ? 'normalization' : 'writing';
    const header = 'profile; file_name; recorded_at; total_records; step\n';
    // const line = `${profile}; ${lower_file_name}; ${time_recorded_at}; ${records}; ${step}\n`;
    // const bash = `${profile} - ${lower_file_name} - ${records} - ${step}\n`;
    const line = `${value}\n`;
    const bash = `${value}\n`;
    const log_file_name = new Date().toISOString().slice(0, 10);
    const log_directory = process.env.PATH_LOGS;
    const path = `${log_directory}/${log_file_name}.csv`;
    ensureDirectoryExists(log_directory);
    ensureFileExists(path, header);
    fs.appendFileSync(path, line);
    process.stdout.write(bash);
    return value;
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
    try {
        return JSON.parse(data.toString());
    } catch (error) {
        error.message = 'Erro de Conversão (COD003)';
        throw error;
    }
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
    recordLog,
    stringifyObject
};
