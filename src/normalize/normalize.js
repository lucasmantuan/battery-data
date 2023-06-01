const _ = require('lodash');

const normalize_formulas = require('./normalize_formulas.js');

const {
    alterarValores,
    convertSreadsheets,
    convertToLowercase,
    converterData,
    definirExtensao,
    definirPlanilha,
    dividirPlanilhas,
    flattenData,
    lerDiretorio,
    mapearObjeto,
    readSpreadsheets,
    removeWhitespace,
    renameKeysIfNeeded
} = require('./normalize_functions.js');

function normalize(planilhas, profile) {
    const { rename_keys, change_values, map_object } = profile;

    const resultado = readSpreadsheets(planilhas)
        .then(convertSreadsheets)
        .then(flattenData)
        .then(removeWhitespace)
        .then(convertToLowercase)
        .then(renameKeysIfNeeded(rename_keys));
    // .then(alterarValores(normalize_formulas[change_values[0]], change_values[1], change_values[2]))
    // .then(mapearObjeto(map_object))zz
    // .then(converterData('date'));

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
