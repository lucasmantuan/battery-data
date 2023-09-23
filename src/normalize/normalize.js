const {
    addValuesIfNeeded,
    changeValuesIfNeeded,
    chunkSplit,
    convertDateIfNeeded,
    convertSpreadsheets,
    convertValuesIfNeeded,
    fileExtension,
    flattenData,
    mapObjectIfNeeded,
    mergeWithFilesIfNeeded,
    readFolder,
    readSpreadsheets,
    removeInvalidDataIfNeeded,
    removeWhitespace,
    renameKeysIfNeeded,
    writeFileIfNeeded
} = require('./normalize_functions.js');

/**
 * Normaliza os dados dos arquivos aplicando uma sequência de transformações
 * com base nos parâmetros fornecidos pelo perfil.
 *
 * @param {Array<string>} folder_list
 * Array com a lista dos arquivos para processamento.
 *
 * @param {Object} profile
 * Objeto contendo os parâmetros de configuração.
 *
 * @param {Object<*, *>} profile.conversion
 * Objeto contendo as configurações de conversão dos dados dos arquivos.
 *
 * @param {Object<*, *>} profile.file
 * Objeto contendo as configurações do arquivo que será processado.
 *
 * @returns {Promise<Array<Object>>}
 * Promise que resolve em um array de objetos normalizados.
 */
function normalize(folder_list, profile) {
    const { rename_keys, change_values, add_values, validate_value, convert_values, map_object, date } =
        profile.conversion;

    const { worksheet_number, file_name, file_list } = profile.file;

    const result = readSpreadsheets(folder_list, worksheet_number)
        .then(convertSpreadsheets)
        .then(flattenData)
        .then(removeWhitespace)
        .then(convertValuesIfNeeded(convert_values))
        .then(renameKeysIfNeeded(rename_keys))
        .then(changeValuesIfNeeded(change_values))
        .then(addValuesIfNeeded(add_values))
        .then(removeInvalidDataIfNeeded(validate_value))
        .then(mapObjectIfNeeded(map_object))
        .then(convertDateIfNeeded(date))
        .then(mergeWithFilesIfNeeded(file_list))
        .then(writeFileIfNeeded(file_name));
    return result;
}

/**
 * Divide uma lista de arquivos dentro de uma pasta em blocos, com base nos parâmetros fornecidos.
 *
 * @param {string} folder
 * String com o local dos arquivos para divisão.
 *
 * @param {Object} profile
 * Objeto contendo os parâmetros para manipulação dos arquivos.
 *
 * @param {Object} profile.file
 * Objeto contendo as configurações do arquivo que será processado.
 *
 * @param {number} chunk
 * Tamanho do pedaço em que os arquivos devem ser divididos.
 *
 * @returns {Promise<Array<Array>>}
 * Promise que resolve em um array de arrays de caminhos de arquivos.
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
