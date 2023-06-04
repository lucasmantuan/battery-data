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
 * Normaliza as planilhas, aplicando uma sequencia de transformações com base em um parâmetro fornecido.
 *
 * @param {{ paths: string[]; worksheet: number; }} folder_list
 * Objeto contendo o caminho e o indice dos arquivos para normalização.
 *
 * @param {{ rename_keys: object; change_values: array; map_object: object; date: string; }} profile
 * Objeto contendo os parâmetros para a normalização dos arquivos.;
 *
 * @returns {Promise<object>}
 * Promise contendo os objetos normalizados.
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

function read(folder, profile, chunk) {
    const { file_extension } = profile.file;
    const result = readFolder(folder).then(fileExtension(file_extension)).then(chunkSplit(chunk));
    return result;
}

module.exports = {
    normalize,
    read
};
