const _ = require('lodash');
const fs = require('fs');
const normalize_formulas = require('./normalize_formulas');
const path = require('path');
const xlsx = require('xlsx');
const { global_parameters } = require('../utils/global_parameters');

xlsx.set_fs(fs);

/**
 * Retorna uma função que verifica a necesidade de se aplicar uma função nos dados.
 *
 * @param {Array<*>} param
 * Array vazio ou com os parâmetros para aplicação nos dados.
 *
 * @returns {(data: Array<Object>) => Array<Object>}
 * Função que adiciona novos valores aos dados se o parâmetro não estiver vazio.
 */
function addValuesIfNeeded(param) {
    /**
     * Retorna os dados sem alteração ou com os novos valores adicionados.
     *
     * @param {Array<Object>} data
     * Array com os dados para aplicação da função.
     *
     * @returns {Array<Object>}
     * Array com os dados sem alteração ou com os novos valores adicionados.
     */
    return function (data) {
        if (_.isEmpty(param)) {
            return data;
        } else {
            return addValues(param, data);
        }
    };
}

/**
 * Adiciona novos valores para cada item de dados com base nos parâmetros fornecidos.
 *
 * @param {Array<*>} param
 * Array contendo o nome da função de callback a ser aplicada,
 * os seus parâmetros e o nome da chave para o novo valor.
 *
 * @param {Array<Object>} data
 * Array com os dados para aplicação da função de callback.
 *
 * @returns {Array<Object>}
 * Array com os dados após a aplicação da função de callback.
 */
function addValues(param, data) {
    _.forEach(param, (param_item) => {
        const [callback_name, params, key] = param_item;
        const callback = normalize_formulas[callback_name];
        _.forEach(data, (data_item) => {
            const value = callback(params, global_parameters);
            _.set(data_item, key, value);
        });
    });
    return data;
}

/**
 * Retorna uma função que verifica a necesidade de se aplicar uma função nos dados.
 *
 * @param {Array<*>} param
 * Array vazio ou com os parâmetros para aplicação nos dados.
 *
 * @returns {(data: Array<Object>) => Array<Object>}
 * Função que modifica os valores dos dados se o parâmetro não estiver vazio.
 */
function changeValuesIfNeeded(param) {
    /**
     * Retorna os dados sem alteração ou com os valores modificados.
     *
     * @param {Array<Object>} data
     * Array com os dados para aplicação da função.
     *
     * @returns {Array<Object>}
     * Array com os dados sem alteração ou com os valores modificados.
     */
    return function (data) {
        if (_.isEmpty(param)) {
            return data;
        } else {
            return changeValues(param, data);
        }
    };
}

/**
 * Modifica os valores de cada item de dados com base nos parâmetros fornecidos.
 *
 * @param {Array<*>} param
 * Array contendo o nome da função de callback a ser aplicada, os seus parâmetros,
 * novos parâmetros, se necessário, e o nome da chave para modificação do valor.
 *
 * @param {Array<Object>} data
 * Array com os dados para aplicação da função de callback.
 *
 * @returns {Array<Object>}
 * Array com os dados após a aplicação da função de callback.
 */
function changeValues(param, data) {
    _.forEach(param, (param_item) => {
        const [callback_name, params, new_params, key] = param_item;
        const callback = normalize_formulas[callback_name];
        _.forEach(data, (data_item) => {
            const values = _.values(_.pick(data_item, params));
            const new_value = callback(values, new_params);
            _.set(data_item, key, new_value);
        });
    });
    return data;
}

/**
 * Retorna uma função que divide um array em partes do tamanho especificado.
 *
 * @param {number} chunk
 * O tamanho de cada parte.
 *
 * @returns {(data: Array<*>) => Array<Array> | Array<*>}
 * Função que recebe um array e retorna um array de arrays.
 */
function chunkSplit(chunk) {
    /**
     * Retorna um array de arrays dividido conforme o tamanho especificado.
     *
     * @param {Array<*>} params
     * Array com os dados para divisão.
     *
     * @returns {Array<Object>}
     * Array de arrays dividido conforme o tamanho especificado.
     */
    return function (params) {
        return _.chunk(params, chunk);
    };
}

/**
 * Retorna uma função que verifica a necesidade de converter as datas especificadas
 * nos parâmetros fornecidos para o formato 'YYYY-MM-DD HH:MM:SS'.
 *
 * @param {Array<string>} param
 * Array vazio ou um array com os nomes das chaves que contém as datas a serem convertidas.
 *
 * @returns {(data: Array<Object>) => Array<Object>}
 * Função que converte as datas dos dados se o parâmetro não estiver vazio.
 */
function convertDateIfNeeded(param) {
    /**
     * Retorna os dados sem alteração ou com as datas convertidas.
     *
     * @param {Array<Object>} data
     * Array com os dados para aplicação da função.
     *
     * @returns {Array<Object>}
     * Array com as datas sem alteração com com as datas convertidas.
     */
    return function (data) {
        if (_.isEmpty(param)) {
            return data;
        } else {
            return converteDate(param, data);
        }
    };
}

/**
 * Modifica as datas dos itens de dados com base nos parâmetros
 * fornecidos para o formato 'YYYY-MM-DD HH:MM:SS'.
 *
 * @param {Array<*>} param
 * Array contendo os nomes das chaves que contém as datas a serem convertidas.
 *
 * @param {Array<Object>} data
 * Array com os dados para conversãop das datas.
 *
 * @returns {Array<Object>}
 * Array com os dados após a conversão das datas.
 */
function converteDate(param, data) {
    _.forEach(param, (param_item) => {
        _.forEach(data, (data_item) => {
            _.mapValues(data_item, (value, key) => {
                if (key === param_item && value != null) {
                    _.set(data_item, key, value.toISOString().slice(0, 19).replace('T', ' '));
                }
            });
        });
    });
    return data;
}

/**
 * Retorna uma Promise que recebe um array com os dados
 * brutos e resolve para um array de objetos mapeados.
 *
 * @param {Array<Object>} data
 * Array contento os dados brutos para a conversão.
 *
 * @returns {Promise<Array<Object>>} -
 * Promise que resolve para um array de objetos mapeados.
 */
function convertSpreadsheets(data) {
    return new Promise((resolve) => {
        const header_file = global_parameters.header;
        const raw_numbers = global_parameters.raw_numbers;
        let result = [];
        result = _.map(data, (spreadsheet) =>
            xlsx.utils.sheet_to_json(spreadsheet, {
                header: _.isEmpty(header_file) ? undefined : header_file,
                rawNumbers: raw_numbers
            })
        );
        resolve(result);
    });
}

/**
 * Converte as chaves dos objetos para letras minúsculas.
 *
 * @param {Array<Object>} data
 * Arrray com os objetos para conversão das chaves.
 *
 * @returns {Array<Object>}
 * Array de objetos com as chaves convertidas para letras minúsculas.
 */
function convertToLowercase(data) {
    const result = _.map(data, (item) => {
        return _.mapKeys(item, (value, key) => _.toLower(key));
    });
    return result;
}

/**
 * Retorna uma função que verifica a necesidade de se aplicar uma função para conversão dos dados.
 *
 * @param {Array<*>} param
 * Array vazio ou com os parâmetros para conversão dos dados.
 *
 * @returns {(data: Array<Object>) => Array<Object>}
 * Função que converte os valores dos dados se o parâmetro não estiver vazio.
 */
function convertValuesIfNeeded(param) {
    /**
     * Retorna os dados sem alteração ou com os valores convertidos.
     *
     * @param {Array<Object>} data
     * Array com os dados para aplicação da função de conversão.
     *
     * @returns {Array<Object>}
     * Array com os dados sem alteração ou com os valores convertidos
     */
    return function (data) {
        if (_.isEmpty(param)) {
            return data;
        } else {
            return convertValues(param, data);
        }
    };
}

/**
 * Converte os valores de cada item de dados com base nos parâmetros fornecidos.
 *
 * @param {Array<*>} param
 * Array contendo o nome da função de callback a ser aplicada e os seus parâmetros de conversão.
 *
 * @param {Array<Object>} data
 * Array com os dados para aplicação da função de callback.
 *
 * @returns {Array<Object>}
 * Array com os dados após a aplicação da função de callback.
 */
function convertValues(param, data) {
    _.forEach(param, (param_item) => {
        const [callback_name, params] = param_item;
        const callback = normalize_formulas[callback_name];
        _.forEach(data, (data_item) => {
            _.forEach(data_item, (value, key) => {
                const new_value = callback(value, params);
                _.set(data_item, key, new_value);
            });
        });
    });
    return data;
}

function deleteFile(data) {
    const file_name = `src/temp/${global_parameters.file_name[0].toString()}`;
    if (fs.existsSync(file_name)) {
        fs.rmSync(file_name);
    }
    return data;
}

/**
 * Retorna uma função que filtra um array de strings com base na extensão fornecida.
 *
 * @param {string} extension
 * A extensão que será usada para filtrar o array de strings.
 *
 * @returns {((data: Array<string>) => Array<string>)}
 * A função que filtra o array de strings com base na extensão fornecida.
 */
function fileExtension(extension) {
    return function (data) {
        return data.filter((item) => item.endsWith(extension));
    };
}

/**
 * Retorna um array achatado em um níel a partir de um array aninhado.
 *
 * @param {Array<Array>} data
 * O array aninhado a ser achatado.
 *
 * @returns {Array<*>}
 * O array achatado em um nível.
 */
function flattenData(data) {
    return _.flatten(data);
}

/**
 * Retorna uma função que verifica a necessidade de mapear os dados.
 *
 * @param {Object} param
 * Objeto vazio ou com os pares chave-valor representando o mapeamento do objeto.
 *
 * @returns {((data: Array<Object>) => Array<Object>)}
 * Função que mapeia os objetos dos dados se o parâmetro não estiver vazio.
 */
function mapObjectIfNeeded(param) {
    /**
     * Retorna os objtos sem alteração ou com os objetos mapeados.
     *
     * @param {Array<Object>} data
     * Array com os objetos para mapeamento.
     *
     * @returns {Array<Object>}
     * Array com os ohjetos em alteração ou com os valores mapeados.
     */
    return function (data) {
        if (_.isEmpty(param)) {
            return data;
        } else {
            return mapObject(param, data);
        }
    };
}

/**
 * Faz o mapeamento do objeto com base nos parâmetros fornecidos.
 *
 * @param {Object} param
 * Objeto com pares chave-valor representando o mapeamento do objeto.
 *
 * @param {Array<Object>} data
 * Array contendo os objetos de dados a serem processados.
 *
 * * @returns {Array<Object>}
 * Array contendo os objetos de dados mapeados.
 */
function mapObject(param, data) {
    // return _.map(data, (item) => {
    //     return _.reduce(
    //         _.keys(item),
    //         (acc, key) => {
    //             if (param[key]) acc[param[key]] = item[key];
    //             return acc;
    //         },
    //         {}
    //     );
    // });
    return _.map(data, (item) => {
        const mapped_item = {};
        _.each(param, (new_key, old_key) => {
            mapped_item[new_key] = item[old_key] !== undefined ? item[old_key] : undefined;
        });
        return mapped_item;
    });
}

/**
 * Faz a leitura do conteúdo de uma pasta e resolve em um array de caminhos de arquivos.
 *
 * @param {string} folder
 * O caminho da pasta para leitura.
 *
 * @returns {Promise<Array<string>>}
 * Uma promise que resolve para um array de caminhos de arquivos.
 */
function readFolder(folder) {
    return new Promise((resolve) => {
        const files = fs.readdirSync(folder);
        const result = _.map(files, (file) => path.join(folder, file));
        resolve(result);
    });
}

/**
 * Faz a leitura dos arquivos de uma lista de pastas e retorna
 *  uma promise que resolve para um array de arquivos.
 *
 * @param {Array<string>} folder_list
 * Array com o caminho das pastas com os arquivos para a leitura.
 *
 * @param {number} worksheet_number
 * O índice do arquivo para o processamento.
 *
 * @returns {Promise<Array<Object>>}
 * Promise que resolve para um array de arquivos.
 */
function readSpreadsheets(folder_list, worksheet_number) {
    const result = Promise.all(
        _.map(folder_list, (folder) => readSpreadsheet(folder, worksheet_number))
    );
    return result;
}

/**
 * Faz a leitura de um arquivo e retorna uma promise que resolve para o arquivo especificado.
 *
 * @param {string} path
 * Caminho do arquivo para a leitura.
 *
 * @param {number} index
 * O indice do arquivo para leitura.
 *
 * @returns {Promise}
 * Promise que resolve para o arquivo especificado.
 */
function readSpreadsheet(path, index) {
    return new Promise((resolve) => {
        const file = xlsx.readFile(path, { cellDates: true });
        const spreadsheet = file.Sheets[file.SheetNames[index]];
        resolve(spreadsheet);
    });
}
function recordLog(data) {
    const header = `profile; file_name; recorded_at; total_records\n`;
    const log_file_name = new Date().toISOString().slice(0, 10);
    const file_name = global_parameters.file_name[0].toLowerCase();
    const profile = global_parameters.profile;
    const recorded_at = global_parameters.recorded_at;
    const total_records = data.length;
    const line = `${profile}; ${file_name}; ${recorded_at}; ${total_records}\n`;
    if (!fs.existsSync('src/logs')) fs.mkdirSync('src/logs');
    if (!fs.existsSync(`src/logs/${log_file_name}.csv`))
        fs.writeFileSync(`src/logs/${log_file_name}.csv`, header);
    fs.appendFileSync(`src/logs/${log_file_name}.csv`, line);
    return data;
}

/**
 * Retorna uma função que remove os dados inválidos com base nos parametros fornecidos.
 *
 * @param {Object} param
 * Objeto com os parâmetros para validação dos dados.
 *
 * @returns {(data: Array<Object>) => Array<Object>}
 * Função que retorna o array com os dados invállidos removidos.
 */
function removeInvalidDataIfNeeded(param) {
    /**
     * Retorna os dados sem alteração ou com os dados inválidos removidos.
     *
     * @param {Array<Object>} data
     * Array com os objtos para a validação dos dados.
     *
     * @returns {Array<Object>}
     * Array com os dados sem alteração ou com os valores inválidos removidos.
     */
    return function (data) {
        if (_.isEmpty(param)) {
            return data;
        } else {
            return removeInvalidData(param, data);
        }
    };
}

/**
 * Remove os daos inválidos com base nos parâmetros fornecidos.
 *
 * @param {Object} param
 * Objeto com os parâmetros para validação dos dados.
 *
 * @param {Array<Object>} data
 * Array com os objetos para a validação dos dados.
 *
 * @returns {Array<Object>}
 * Array com os valores inválidos removidos.
 */
function removeInvalidData(param, data) {
    return _.filter(data, (item) => {
        return _.every(param, (param) => {
            const { key, type } = param;
            const values = _.values(item);
            return typeof values[key] === type;
        });
    });
}

/**
 * Remove os espaços das chaves de um array de objetos.
 *
 * @param {Array<Object>} data
 * Array contendo os objetos para a remoção dos espaços em branco das chaves.
 *
 * @returns {Array<Object>}
 * Array de objetos com os espaços em branco das chaves removido.
 */
function removeWhitespace(data) {
    const result = _.map(data, (item) => {
        return _.mapKeys(item, (value, key) => _.trim(key));
    });
    return result;
}

/**
 * Retorna uma função que renomeia as chaves de um array de objetos com base no parâmetro fornecido.
 *
 * @param {Object} param
 * Objeto com os parâmetros para renomear os dados.
 *
 * @returns {(data: Array<Object>) => Array<Object>}
 * Função que retorna o array com os dados renomeados.
 */
function renameKeysIfNeeded(param) {
    /**
     * Retorna os dados sem alteração ou com os dados renomeados.
     *
     * @param {Array<Object>} data
     * Array com os objetos para a validação dos dados.
     *
     * @returns {Array<Object>}
     * Array com os dados sem alteração ou com os valores renomeados.
     */
    return function (data) {
        if (_.isEmpty(param)) {
            return data;
        } else {
            return renameKeys(param, data);
        }
    };
}

/**
 * Renomeia as chaves de um array de objetos com base no parâmetro fornecido.
 *
 * @param {Object} param
 * Objeto com pares chave-valor representando as chaves e os novos nomes das chaves.
 *
 * @param {Array<Object>} data
 * Array contendo os objetos de dados para renomeação das chaves.
 *
 * @returns {Array<Object>}
 * Array contendo os objetos de dados com as chaves renomeadas.
 */
function renameKeys(param, data) {
    const result = _.map(data, (item) => {
        return _.mapKeys(item, (value, key) => {
            if (param[key]) return param[key];
            return key;
        });
    });
    return result;
}

function writeFileIfNeeded(param) {
    return function (data) {
        if (_.isEmpty(param)) {
            return data;
        } else {
            return writeFile(param, data);
        }
    };
}

function writeFile(param, data) {
    const [file_name, file_extension] = param;
    const workbook = xlsx.utils.book_new();
    const worksheet = xlsx.utils.json_to_sheet(data);
    xlsx.utils.book_append_sheet(workbook, worksheet, 'data');
    xlsx.writeFile(workbook, file_name, { bookType: file_extension });
    return data;
}

module.exports = {
    addValuesIfNeeded,
    changeValuesIfNeeded,
    chunkSplit,
    convertDateIfNeeded,
    convertSpreadsheets,
    convertToLowercase,
    convertValuesIfNeeded,
    deleteFile,
    fileExtension,
    flattenData,
    mapObjectIfNeeded,
    readFolder,
    readSpreadsheets,
    recordLog,
    removeInvalidDataIfNeeded,
    removeWhitespace,
    renameKeysIfNeeded,
    writeFileIfNeeded
};
