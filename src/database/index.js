const fs = require('fs');
const { create } = require('./database');
const { parseToObject } = require('../utils/utils');
require('dotenv').config();

const database_profiles = ['mysql'];

const parameters = {
    profile: String(process.argv[2])
};

if (database_profiles.includes(parameters.profile)) {
    const data_profile_used = processProfile(parameters.profile);
    createAsync(data_profile_used);
}

function processProfile(profile) {
    const path = `${process.env.PATH_PROFILES}/${profile}.json`;
    const result = fs.readFileSync(path);
    return parseToObject(result);
}

async function createAsync(profile) {
    const result = await create(profile);
    return result;
}
