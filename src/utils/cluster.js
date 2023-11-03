const _ = require('lodash');
const cluster = require('cluster');
const cpus = require('os').cpus().length;
const { database } = require('../database-normalizer/database');
const { getFileName } = require('../utils/utils');
const { global_parameters } = require('../utils/global_parameters');
const { normalize } = require('../normalizer/normalize');

/**
 * Cria um balanceador de carga simples para efetuar o processamento dos dados,
 * distribuindo os itens entre os processadores disponíveis no computador.
 *
 * @param {Array<*>} list_files
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
function createCluster(list_files, profile_data, profile_database) {
    if (cluster.isPrimary) {
        let items_processed = 0;
        const total_items = list_files.length;

        _.forEach(list_files, function (item, index) {
            if (index < Math.min(cpus, total_items)) {
                const worker = cluster.fork();
                worker.send(item);
                items_processed++;
            }
        });

        cluster.on('message', function (worker) {
            if (items_processed < total_items) {
                const item = list_files[items_processed];
                worker.send(item);
                items_processed++;
            } else {
                worker.disconnect();
            }
        });
    } else {
        process.on('message', async function (item) {
            global_parameters.id = cluster.worker.id;
            global_parameters.recorded_at = new Date();
            global_parameters.file_name = getFileName(item);
            global_parameters.header = profile_data.file.header;
            global_parameters.profile = profile_data.file.profile_name;
            global_parameters.raw_numbers = profile_data.file.raw_numbers;
            const data = await normalize(item, profile_data);
            await database(data, profile_database);
            process.send('processed');
        });
    }
}

module.exports = { createCluster };
