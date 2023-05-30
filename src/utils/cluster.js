const cluster = require('cluster');
const cpus = require('os').cpus().length;
const readline = require('readline');
const { normalize } = require('../normalize/normalize.js');

function createCluster(data, profile) {
    if (cluster.isPrimary) {
        const total_items = data.length;
        let items_processed = 0;

        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });

        const updatePercentage = (percentCompleted) => {
            readline.cursorTo(process.stdout, 0, 1);
            process.stdout.write(`Processando: ${percentCompleted.toFixed(2)}%`);
            readline.moveCursor(process.stdout, 0, 0);
            readline.clearScreenDown(process.stdout);
        };

        for (let i = 0; i < Math.min(cpus, total_items); i++) {
            const worker = cluster.fork();
            const item = data[i];
            worker.send(item);

            const percentCompleted = (items_processed / total_items) * 100;
            updatePercentage(percentCompleted);

            items_processed++;
        }

        cluster.on('message', (worker) => {
            const percentCompleted = (items_processed / total_items) * 100;
            updatePercentage(percentCompleted);

            if (items_processed < total_items) {
                const item = data[items_processed];
                worker.send(item);
                items_processed++;
            } else {
                process.stdout.write('\n');
                worker.kill();
                rl.close();
            }
        });
    } else {
        process.on('message', (item) => {
            normalize(item, profile).then((result) => {
                process.send(result);
            });
        });
    }
}

module.exports = { createCluster };
