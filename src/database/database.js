const { openConnection, createTable, writeData, closeConnection } = require('./database_functions.js');

function database(data, profile) {
    const { connection, table } = profile.database;

    const result = openConnection(connection)
        .then(createTable(table.name, table.schema))
        .then(writeData(data))
        .then(closeConnection);

    return result;
}

module.exports = {
    database
};
