const cluster = require('cluster');
const cpus = require('os').cpus().length;
const readline = require('readline');
const { database } = require('../database/database.js');
const { normalize } = require('../normalize/normalize.js');

const readline_interface = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

/**
 * Atualiza o percentual de conclusão do processamento dos arquivos no terminal.
 *
 * @param {number} items_processed
 * Total de itens processados.
 *
 * @param {number} total_items
 * Total de itens pra processamento.
 */
function updateStatus(items_processed, total_items) {
    const percent_completed = (items_processed / total_items) * 100;
    readline.cursorTo(process.stdout, 0, 1);
    process.stdout.write(percent_completed.toFixed(0) + '%');
    readline.moveCursor(process.stdout, 0, 0);
    readline.clearScreenDown(process.stdout);
}

/**
 * Cria um balanceador de carga simples para efetuar o processamento dos dados
 * distribuindo os itens entre os processadores disponíveis no computador.
 *
 * @param {Array} data
 * Um array contendo o caminho dos arquivos a serem processados.
 *
 * @param {Object} profile
 * Um objeto contendo os parâmetros para normalização dos dados.
 *
 * @returns {void} Essa função não retorna nenhum valor.
 */
function createCluster(data, profile) {
    // @ts-ignore
    if (cluster.isPrimary) {
        let items_processed = 0;
        const total_items = data.length;

        data.forEach((item, index) => {
            if (index < Math.min(cpus, total_items)) {
                // @ts-ignore
                const worker = cluster.fork();
                worker.send(item);
                items_processed++;
                updateStatus(items_processed, total_items);
            }
        });

        // @ts-ignore
        cluster.on('message', (worker) => {
            if (items_processed < total_items) {
                const item = data[items_processed];
                worker.send(item);
                items_processed++;
                updateStatus(items_processed, total_items);
            } else {
                process.stdout.write('\n');
                worker.kill();
                readline_interface.close();
            }
        });
    } else {
        process.on('message', async function (item) {
            // @ts-ignore
            const data = await normalize(item, profile);
            const result = await database(data, profile);
            process.send(result);
        });
    }
}

module.exports = { createCluster };
