const fs = require('fs');
const { create } = require('../database-normalizer/database');
const { createCluster } = require('../utils/cluster');
const { parseToObject } = require('../utils/utils');
const { read } = require('./normalize');

let data = [];
let temp = 'src/temp';
let profile_data = {};
let profile_database = {};

const parameters = {
    profile: String(process.argv[2].split('-')[1]),
    database: process.argv[3] ? String(process.argv[3].split('-')[1]) : undefined
};

async function readAsync(folder, profile_data, profile_database) {
    data = await read(folder, profile_data);
    createCluster(data, profile_data, profile_database);
}

async function createAsync(profile) {
    const result = await create(profile);
    return result;
}

if (parameters.database === 'mysql') {
    const result = fs.readFileSync(`src/profiles/${parameters.database}.json`);
    profile_database = parseToObject(result);
}

if (parameters.profile === 'mysql') {
    const result = fs.readFileSync(`src/profiles/${parameters.profile}.json`);
    profile_data = parseToObject(result);
    createAsync(profile_data)
        .then((result) => console.log(result))
        .then(() => process.exit());
}

if (parameters.profile === 'arbin') {
    const result = fs.readFileSync(`src/profiles/${parameters.profile}.json`);
    profile_data = parseToObject(result);
    readAsync(temp, profile_data, profile_database);
}

if (parameters.profile === 'hh') {
    const result = fs.readFileSync(`src/profiles/${parameters.profile}.json`);
    profile_data = parseToObject(result);
    readAsync(temp, profile_data, profile_database);
}

if (parameters.profile === 'regatron') {
    const result = fs.readFileSync(`src/profiles/${parameters.profile}.json`);
    profile_data = parseToObject(result);
    readAsync(temp, profile_data, profile_database);
}

if (parameters.profile === 'bk') {
    const result = fs.readFileSync(`src/profiles/${parameters.profile}.json`);
    profile_data = parseToObject(result);
    readAsync(temp, profile_data, profile_database);
}

if (parameters.profile === 'digatron') {
    const result = fs.readFileSync(`src/profiles/${parameters.profile}.json`);
    profile_data = parseToObject(result);
    readAsync(temp, profile_data, profile_database);
}

if (parameters.profile === 'itech') {
    const result = fs.readFileSync(`src/profiles/${parameters.profile}.json`);
    profile_data = parseToObject(result);
    readAsync(temp, profile_data, profile_database);
}
