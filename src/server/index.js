// const _ = require('lodash');
// const cluster = require('cluster');
// const cpus = require('os').cpus();
const server = require('./bin/server');

const port = process.env.port || 3000;

const startServer = () => {
    server.listen(port, () => {
        console.log('server is running');
    });
};

// function onWorkerError(code, signal) {
//     console.log(code, signal);
// }

// @ts-ignore
// if (cluster.isPrimary) {
// _.forEach(cpus, function () {
// @ts-ignore
// const worker = cluster.fork();
// worker.on('error', onWorkerError);
// });

// @ts-ignore
// cluster.on('exit', function (err) {
// @ts-ignore
//     const new_worker = cluster.fork();
//     new_worker.on('error', onWorkerError);
//     console.log('new worker created', new_worker.process.pid);
// });

// @ts-ignore
//     cluster.on('exit', function (err) {
//         console.log('worker died', err.process.pid);
//     });
// } else {
startServer();
// }
