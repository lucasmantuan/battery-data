const cluster = require('cluster');
const cpus = require('os').cpus().length;
const readline = require('readline');
const { normalize } = require('../normalize/normalize.js');

function createCluster(data, profile) {
    if (cluster.isPrimary) {
        const total_items = data.length;

        let processed_items = 0;

        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });

        const updatePercentage = (p, t) => {
            // const percentCompleted = (p / t) * 100;
            // readline.cursorTo(process.stdout, 0, 1);
            // process.stdout.write(`Processando: ${percentCompleted.toFixed(2)}%`);
            // readline.moveCursor(process.stdout, 0, 0);
            // readline.clearScreenDown(process.stdout);
        };

        for (let i = 0; i < Math.min(cpus, total_items); i++) {
            const worker = cluster.fork();
            const item = data[i];
            worker.send(item);
            updatePercentage(processed_items, total_items);
            processed_items++;
        }

        cluster.on('message', (worker) => {
            updatePercentage(processed_items, total_items);

            if (processed_items < total_items) {
                const item = data[processed_items];
                worker.send(item);
                processed_items++;
            } else {
                process.stdout.write('\n');
                worker.kill();
                rl.close();
            }
        });
    } else {
        process.on('message', (item) => {
            normalize(item, profile).then((result) => {
                console.log(result);
                process.send(result);
            });
        });
    }
}

module.exports = { createCluster };
