const _ = require('lodash');
const cluster = require('cluster');
const cpus = require('os').cpus().length;
const readline = require('readline');
const { database } = require('../database/database.js');
const { getFileName } = require('../utils/utils.js');
const { global_parameters } = require('../utils/global_parameters.js');
const { normalize } = require('../normalize/normalize.js');

/**
 * Exibe o número de arquivos para processamento e o número de arquivos processados no terminal.
 *
 * @param {number} items_processed
 * O total de itens processados.
 *
 * @param {number} total_items
 * O total itens para processamento.
 *
 * @returns {void}
 */
function updateStatus(items_processed, total_items) {
    readline.cursorTo(process.stdout, 0, 1);
    process.stdout.write(`${items_processed}:${total_items}`);
    readline.moveCursor(process.stdout, 0, 0);
    readline.clearScreenDown(process.stdout);
}

/**
 * Cria um balanceador de carga simples para efetuar o processamento dos dados,
 * distribuindo os itens entre os processadores disponíveis no computador.
 *
 * @param {Array<*>} data
 * Um array contendo o caminho dos arquivos a serem processados.
 *
 * @param {Object<*, *>} profile_data
 * Um objeto contendo os parâmetros para normalização dos dados.
 *
 * @param {Object<*, *>} profile_database
 * Um objeto contendo os parâmetros para gravação dos dados no banco de dados.
 *
 * @returns {void}
 */
function createCluster(data, profile_data, profile_database) {
    // @ts-ignore
    if (cluster.isPrimary) {
        let items_processed = 0;
        const total_items = data.length;

        _.forEach(data, function (item, index) {
            if (index < Math.min(cpus, total_items)) {
                // @ts-ignore
                const worker = cluster.fork();
                worker.send(item);
                items_processed++;
                updateStatus(items_processed, total_items);
            }
        });

        // @ts-ignore
        cluster.on('message', function (worker) {
            if (items_processed < total_items) {
                const item = data[items_processed];
                worker.send(item);
                items_processed++;
                updateStatus(items_processed, total_items);
            } else {
                worker.disconnect();
            }
        });
    } else {
        process.on('message', async function (item) {
            // @ts-ignore
            global_parameters.id = cluster.worker.id;
            global_parameters.recorded_at = new Date();
            // @ts-ignore
            global_parameters.file_name = getFileName(item);
            global_parameters.header = profile_data.file.header;
            global_parameters.profile = profile_data.file.profile_name;
            global_parameters.raw_numbers = profile_data.file.raw_numbers;
            // @ts-ignore
            const data = await normalize(item, profile_data);
            // console.log(data);
            // await database(data, profile_database);
            process.send('processed');
        });
    }
}

module.exports = { createCluster };
