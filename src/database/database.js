const { openConnection, createTable, writeData, closeConnection } = require('./database_functions.js');

function database(data, profile) {
    const { connection, table } = profile.database;
    const result = openConnection(connection).then(writeData(data, table)).then(closeConnection);
    return result;
}

function create(profile) {
    const { connection, table } = profile.database;
    const result = openConnection(connection).then(createTable(table)).then(closeConnection);
    return result;
}

module.exports = {
    database,
    create
};
