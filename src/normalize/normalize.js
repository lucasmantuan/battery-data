const {
    changeValuesIfNeeded,
    chunkSplit,
    convertSpreadsheets,
    convertToLowercase,
    convertDateIfNeeded,
    fileExtension,
    flattenData,
    mapObjectIfNeeded,
    readFolder,
    readSpreadsheets,
    removeWhitespace,
    renameKeysIfNeeded
} = require('./normalize_functions.js');

/**
 * Normaliza os arquivos, aplicando uma sequência de transformações, com base nos parâmetros fornecidos.
 *
 * @param {Array<string>} folder_list
 * Objeto com a lista dos arquivos.
 *
 * @param {Object} profile
 * Objeto contendo os parâmetros para manipulação dos arquivos.
 *
 * @param {Object} profile.conversion
 * Objeto contendo as configurações de conversão.
 *
 * @param {Object} profile.file
 * Objeto contendo as configurações do arquivo.
 *
 * @returns {Promise<Array<object>>}
 * Promise que resolve em um array de objetos.
 */
function normalize(folder_list, profile) {
    const { rename_keys, change_values, map_object, date } = profile.conversion;
    const { worksheet_number } = profile.file;

    const result = readSpreadsheets(folder_list, worksheet_number)
        .then(convertSpreadsheets)
        .then(flattenData)
        .then(removeWhitespace)
        .then(convertToLowercase)
        .then(renameKeysIfNeeded(rename_keys))
        .then(changeValuesIfNeeded(change_values))
        .then(mapObjectIfNeeded(map_object))
        .then(convertDateIfNeeded(date));
    return result;
}

/**
 * Divide uma lista de arquivos em blocos com base nos parâmetros fornecidos.
 *
 * @param {string} folder
 * String com o local dos arquivos para divisão.
 *
 * @param {Object} profile
 * Objeto contendo os parâmetros para manipulação dos arquivos.
 *
 * @param {Object} profile.file
 * Objeto contendo as configurações do arquivo.
 *
 * @param {number} chunk
 * Quantidade de itens para cada bloco.
 *
 * @returns {Promise<Array<Array>>}
 * Promise que resolve em um array de arrays.
 */
function read(folder, profile, chunk) {
    const { file_extension } = profile.file;
    const result = readFolder(folder).then(fileExtension(file_extension)).then(chunkSplit(chunk));
    return result;
}

module.exports = {
    normalize,
    read
};
