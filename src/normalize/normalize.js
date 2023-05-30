const normalize_formulas = require('./normalize_formulas.js');

const {
    lerDiretorio,
    definirExtensao,
    definirPlanilha,
    dividirPlanilhas,
    lerPlanilhas,
    converterPlanilhas,
    removerEspacosBranco,
    converterParaMinusculo,
    renomearChaves,
    alterarValores,
    mapearObjeto,
    converterData,
    achatarDados
} = require('./normalize_functions.js');

function normalize(planilhas, profile) {
    const { rename_keys, change_values, map_object } = profile;

    const resultado = lerPlanilhas(planilhas)
        .then(converterPlanilhas)
        .then(removerEspacosBranco)
        .then(converterParaMinusculo)
        .then(renomearChaves(rename_keys))
        .then(alterarValores(normalize_formulas[change_values[0]], change_values[1], change_values[2]))
        .then(mapearObjeto(map_object))
        .then(converterData('date'))
        .then(achatarDados);

    return resultado;
}

function read(folder) {
    const result = lerDiretorio(folder).then(definirExtensao('xlsx')).then(definirPlanilha(1)).then(dividirPlanilhas(1));
    return result;
}

module.exports = {
    normalize,
    read
};
