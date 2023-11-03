const _ = require('lodash');
const cluster = require('cluster');
const cpus = require('os').cpus();
const server = require('./bin/server');
require('dotenv').config();

const port = process.env.SERVER_PORT || 3000;

const startServer = () => {
    server.listen(port, () => {
        console.log('server is running');
    });
};

function onWorkerError(code, signal) {
    console.log(code, signal);
}

if (cluster.isPrimary) {
    _.forEach(cpus, function () {
        const worker = cluster.fork();
        worker.on('error', onWorkerError);
    });

    cluster.on('exit', function () {
        const new_worker = cluster.fork();
        new_worker.on('error', onWorkerError);
        console.log('new worker created', new_worker.process.pid);
    });

    cluster.on('exit', function (err) {
        console.log('worker died', err.process.pid);
    });
} else {
    startServer();
}
