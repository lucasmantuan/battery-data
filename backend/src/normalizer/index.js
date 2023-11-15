const fs = require('fs');
// const { create } = require('../database/database');
const { createCluster } = require('../utils/cluster');
const { parseToObject } = require('../utils/utils');
require('dotenv').config();
// const { read } = require('./normalize');

const data_profiles = ['arbin', 'hh', 'regatron', 'bk', 'digatron', 'itech'];
const database_profiles = ['mysql'];

const parameters = {
    profile: String(process.argv[2]),
    database: String(process.argv[3]),
    files: String(process.argv[4])
};

if (data_profiles.includes(parameters.profile) && database_profiles.includes(parameters.database)) {
    const temporary_folder = process.env.PATH_TEMP;
    const data_profile_used = processProfile(parameters.profile);
    const database_profile_used = processProfile(parameters.database);
    readAsync(temporary_folder, data_profile_used, database_profile_used);
}

// if (database_profiles.includes(parameters.profile)) {
//     const data_profile_used = processProfile(parameters.profile);
//     createAsync(data_profile_used).then(() => process.exit());
// }

function processProfile(profile) {
    const path = `${process.env.PATH_PROFILES}/${profile}.json`;
    const result = fs.readFileSync(path);
    return parseToObject(result);
}

async function readAsync(temporary_folder, profile_data, profile_database) {
    // const folder_list = await read(temporary_folder, profile_data);
    const folder_list = parseToObject(parameters.files);
    createCluster(folder_list, profile_data, profile_database);
}

// async function createAsync(profile) {
//     const result = await create(profile);
//     return result;
// }
