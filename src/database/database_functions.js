const knex_profiles = ['mysql'];
const other_profiles = ['influx'];

function defineDatabase(database_name) {
    if (knex_profiles.includes(database_name)) {
        const database = require('./services/knex');
        return database;
    } else if (other_profiles.includes(database_name)) {
        const database = require(`./services/${database_name}`);
        return database;
    }
}

module.exports = {
    defineDatabase
};
