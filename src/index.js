const fs = require('fs');
const { createCluster } = require('./utils/cluster.js');
const { parseToObject } = require('./utils/utils.js');
const { read } = require('./normalize/normalize.js');

const parameters = {
    profile: String(process.argv[2].split('-')[1]),
    chunk: Number(process.argv[3].split('-')[1]),
    folder: String(process.argv[4])
};

let profile = {};
let data = [];

if (parameters.profile === 'arbin') {
    const result = fs.readFileSync(`./profiles/${parameters.profile}.json`);
    profile = parseToObject(result);
}

async function readAsync(folder, profile) {
    data = await read(folder, profile, parameters.chunk);
    createCluster(data, profile);
}

readAsync(parameters.folder, profile);
