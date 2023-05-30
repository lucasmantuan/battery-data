const fs = require('fs');
const path = require('path');
const xlsx = require('xlsx');
const _ = require('lodash');

xlsx.set_fs(fs);

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
            resultado.push({ caminhos: pedaco, indice });
        }

        return resultado;
    };
}

function lerPlanilhas({ caminhos, indice }) {
    const resultado = Promise.all(caminhos.map((caminho) => lerPlanilha(caminho, indice)));
    return resultado;
}

function lerPlanilha(caminho, indice) {
    return new Promise((resolve, reject) => {
        try {
            const arquivo = xlsx.readFile(caminho, { cellDates: true });
            const planilha = arquivo.Sheets[arquivo.SheetNames[indice]];
            resolve(planilha);
        } catch (error) {
            reject(error);
        }
    });
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
 * Remove os espaços em branco (no início e no final) das chaves dos objetos do array.
 *
 * @param {Array<Object>} data O array contendo os objetos para a remoção dos espaços em branco nas chaves.
 * @returns {Array<Object>} O array de objetos com as chaves alteradas, sem os espaços em branco.
 */
function removeWhitespace(data) {
    const result = _.map(data, (item) => {
        return _.mapKeys(item, (value, key) => _.trim(key));
    });
    return result;
}

/**
 * Converte as chaves dos objetos do array para minúsculas.
 *
 * @param {Array<Object>} data O array contendo os objetos para a conversão das chaves para minúsculas.
 * @returns {Array<Object>} O array de objetos com as chaves convertidas para minúsculas.
 */
function convertToLowercase(data) {
    const result = _.map(data, (item) => {
        return _.mapKeys(item, (value, key) => _.toLower(key));
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

function achatarDados(dados) {
    const dadosAchatados = dados.flat();
    return dadosAchatados;
}

module.exports = {
    lerDiretorio,
    definirExtensao,
    definirPlanilha,
    lerPlanilhas,
    dividirPlanilhas,
    converterPlanilhas,
    removeWhitespace,
    convertToLowercase,
    renomearChaves,
    alterarValores,
    mapearObjeto,
    converterData,
    achatarDados
};
