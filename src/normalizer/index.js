const fs = require('fs');
const { createCluster } = require('../utils/cluster');
const { parseToObject, recordLog } = require('../utils/utils');
const { read } = require('./normalize');
require('dotenv').config();

const data_profiles = ['arbin', 'hh', 'regatron', 'bk', 'digatron', 'itech', 'ori'];
const database_profiles = ['mysql', 'leela'];

const parameters = {
    profile: String(process.argv[2]),
    database: String(process.argv[3]),
    folder: String(process.argv[4])
};

async function start() {
    try {
        if (
            data_profiles.includes(parameters.profile) &&
            database_profiles.includes(parameters.database)
        ) {
            const folder_used = parameters.folder;
            const data_profile_used = processProfile(parameters.profile);
            const database_profile_used = processProfile(parameters.database);
            await readAsync(folder_used, data_profile_used, database_profile_used);
        } else {
            throw new Error('Parâmetros Inválidos (COD001)');
        }
    } catch (error) {
        recordLog(error);
    }
}

function processProfile(profile) {
    try {
        const path = `${process.env.PATH_PROFILES}/${profile}.json`;
        const file = fs.readFileSync(path);
        const result = parseToObject(file);
        return result;
    } catch (error) {
        if (error.message.includes('(COD003)')) {
            throw error;
        } else {
            error.message = 'Perfil Inválido (COD002)';
            throw error;
        }
    }
}

async function readAsync(temporary_folder, profile_data, profile_database) {
    const folder_list = await read(temporary_folder, profile_data);
    createCluster(folder_list, profile_data, profile_database);
}

start();
