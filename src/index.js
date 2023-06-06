const fs = require('fs');
const readline = require('readline');
const { create } = require('./database/database.js');
const { read } = require('./normalize/normalize.js');
const { createCluster } = require('./utils/cluster.js');
const { parseToObject } = require('./utils/utils.js');

let profile = {};
let data = [];

const parameters = {
    profile: String(process.argv[2].split('-')[1]),
    create: String(process.argv[3].split('-')[1]),
    chunk: process.argv[4] ? Number(process.argv[4].split('-')[1]) : undefined,
    folder: process.argv[5] ? String(process.argv[5]) : undefined
};

function updateStatus(status) {
    readline.cursorTo(process.stdout, 0, 1);
    process.stdout.write(`${status}`);
    readline.moveCursor(process.stdout, 0, 0);
    readline.clearScreenDown(process.stdout);
}

if (parameters.profile === 'arbin') {
    const result = fs.readFileSync(`./profiles/${parameters.profile}.json`);
    profile = parseToObject(result);
}

async function readAsync(folder, profile, chunk) {
    data = await read(folder, profile, chunk);
    createCluster(data, profile);
}

async function createAsync(profile) {
    const result = await create(profile);
    return result;
}

function start(folder, profile, chunk, create) {
    if (create === 'true') {
        createAsync(profile)
            .then((result) => updateStatus(result))
            .then(() => process.exit());
    } else {
        readAsync(folder, profile, chunk);
    }
}

start(parameters.folder, profile, parameters.chunk, parameters.create);
