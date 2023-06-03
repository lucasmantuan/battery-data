const {
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
} = require('./normalize_functions.js');

function normalize(spreadsheets, profile) {
    const { rename_keys, change_values, map_object, date } = profile;

    const resultado = readSpreadsheets(spreadsheets)
        .then(convertSreadsheets)
        .then(flattenData)
        .then(removeWhitespace)
        .then(convertToLowercase)
        .then(renameKeysIfNeeded(rename_keys))
        .then(changeValuesIfNeeded(change_values))
        .then(mapObjectIfNeeded(map_object))
        .then(converteDateIfNeeded(date));

    return resultado;
}

function read(folder) {
    const result = lerDiretorio(folder)
        .then(definirExtensao('xlsx'))
        .then(definirPlanilha(1))
        .then(dividirPlanilhas(8));
    return result;
}

module.exports = {
    normalize,
    read
};
