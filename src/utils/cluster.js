const cluster = require('cluster');
const cpus = require('os').cpus().length;
const { normalize } = require('../normalize/normalize.js');

function createCluster(data, profile) {
    if (cluster.isPrimary) {
        const total_items = data.length;
        let processed_items = 0;

        for (let i = 0; i < Math.min(cpus, total_items); i++) {
            const worker = cluster.fork();
            const item = data[i];
            worker.send(item);
            processed_items++;
        }

        cluster.on('message', (worker, message) => {
            // console.log(`${worker.id} - ${message.length}`);

            if (processed_items < total_items) {
                const item = data[processed_items];
                worker.send(item);
                processed_items++;
            } else {
                worker.kill();
            }
        });
    } else {
        process.on('message', (item) => {
            var ini = performance.now();
            normalize(item, profile).then((result) => {
                process.send(result);
            });
            var fim = performance.now();
            console.log(fim - ini);
        });
    }
}

module.exports = { createCluster };
