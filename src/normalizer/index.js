const fs = require('fs');
const { createCluster } = require('../utils/cluster');
const { parseToObject } = require('../utils/utils');
const { read } = require('./normalize');
require('dotenv').config();

const data_profiles = ['arbin', 'hh', 'regatron', 'bk', 'digatron', 'itech'];
const database_profiles = ['mysql'];

const parameters = {
    profile: String(process.argv[2]),
    database: String(process.argv[3]),
    folder: String(process.argv[4])
};

function processProfile(profile) {
    const path = `${process.env.PATH_PROFILES}/${profile}.json`;
    const result = fs.readFileSync(path);
    return parseToObject(result);
}

if (data_profiles.includes(parameters.profile) && database_profiles.includes(parameters.database)) {
    const folder_used = parameters.folder;
    const data_profile_used = processProfile(parameters.profile);
    const database_profile_used = processProfile(parameters.database);
    readAsync(folder_used, data_profile_used, database_profile_used);
}

async function readAsync(temporary_folder, profile_data, profile_database) {
    const folder_list = await read(temporary_folder, profile_data);
    createCluster(folder_list, profile_data, profile_database);
}
