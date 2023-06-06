const knex = require('knex');
const _ = require('lodash');

function openConnection(connection_config) {
    return new Promise((resolve) => {
        // @ts-ignore
        const connection = knex(connection_config);
        resolve(connection);
    });
}

function createTable(table_name, table_schema) {
    return function (connection) {
        return connection.schema.hasTable(table_name).then((has_table) => {
            if (!has_table) {
                return connection.schema
                    .createTable(table_name, function (table) {
                        _.forEach(_.toPairs(table_schema), ([column, params]) => {
                            const { type, ...param } = params;
                            table[type](column, ..._.values(param));
                        });
                    })
                    .then(() => {
                        return { connection, table_name };
                    });
            } else {
                return { connection, table_name };
            }
        });
    };
}

function writeData(data) {
    return function (param) {
        const { connection, table_name } = param;
        return connection(table_name)
            .insert(data)
            .then(() => {
                return { connection, table_name };
            });
    };
}

function closeConnection(param) {
    const { connection } = param;
    connection.destroy();
    return true;
}

module.exports = {
    openConnection,
    createTable,
    closeConnection,
    writeData
};
