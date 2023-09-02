const fs = require('fs');
const readline = require('readline');
const { create } = require('./database/database.js');
const { createCluster } = require('./utils/cluster.js');
const { parseToObject } = require('./utils/utils.js');
const { read } = require('./normalize/normalize.js');

let data = [];
let profile_data = {};
let profile_database = {};

const parameters = {
    profile: String(process.argv[2].split('-')[1]),
    database: process.argv[3] ? String(process.argv[3].split('-')[1]) : undefined,
    chunk: process.argv[4] ? Number(process.argv[4].split('-')[1]) : undefined,
    folder: process.argv[5] ? String(process.argv[5]) : undefined
};

function updateStatus(status) {
    readline.cursorTo(process.stdout, 0, 1);
    process.stdout.write(`${status}`);
    readline.moveCursor(process.stdout, 0, 0);
    readline.clearScreenDown(process.stdout);
}

async function readAsync(folder, profile_data, chunk, profile_database) {
    data = await read(folder, profile_data, chunk);
    createCluster(data, profile_data, profile_database);
}

async function createAsync(profile) {
    const result = await create(profile);
    return result;
}

if (parameters.database === 'mysql') {
    const result = fs.readFileSync(`./profiles/${parameters.database}.json`);
    profile_database = parseToObject(result);
}

if (parameters.profile === 'mysql') {
    const result = fs.readFileSync(`./profiles/${parameters.profile}.json`);
    profile_data = parseToObject(result);
    createAsync(profile_data)
        .then((result) => updateStatus(result))
        .then(() => process.exit());
}

if (parameters.profile === 'arbin') {
    const result = fs.readFileSync(`./profiles/${parameters.profile}.json`);
    profile_data = parseToObject(result);
    readAsync(parameters.folder, profile_data, parameters.chunk, profile_database);
}

if (parameters.profile === 'hh') {
    const result = fs.readFileSync(`./profiles/${parameters.profile}.json`);
    profile_data = parseToObject(result);
    readAsync(parameters.folder, profile_data, parameters.chunk, profile_database);
}

if (parameters.profile === 'regatron') {
    const result = fs.readFileSync(`./profiles/${parameters.profile}.json`);
    profile_data = parseToObject(result);
    readAsync(parameters.folder, profile_data, parameters.chunk, profile_database);
}

if (parameters.profile === 'bk') {
    const result = fs.readFileSync(`./profiles/${parameters.profile}.json`);
    profile_data = parseToObject(result);
    readAsync(parameters.folder, profile_data, parameters.chunk, profile_database);
}

if (parameters.profile === 'digatron') {
    const result = fs.readFileSync(`./profiles/${parameters.profile}.json`);
    profile_data = parseToObject(result);
    readAsync(parameters.folder, profile_data, parameters.chunk, profile_database);
}
