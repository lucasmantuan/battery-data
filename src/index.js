const fs = require('fs');
const { createCluster } = require('./utils/cluster.js');
const { parseToObject } = require('./utils/utils.js');
const { read } = require('./normalize/normalize.js');

const profile = process.argv[2].split('-')[1];
const folder = process.argv[3];

let info = {};
let data = [];

if (profile == 'arbin') {
    const file = fs.readFileSync(`./profiles/${profile}.json`);
    info = parseToObject(file);
}

async function readAsync(folder, info) {
    data = await read(folder, info, 1);
    createCluster(data, info);
}

readAsync(folder, info);