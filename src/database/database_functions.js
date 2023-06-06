const knex = require('knex');
const _ = require('lodash');

function openConnection(connection_config) {
    return new Promise((resolve) => {
        // @ts-ignore
        const connection = knex(connection_config);
        resolve(connection);
    });
}

function createTable(param) {
    const { name, schema } = param;
    return function (connection) {
        return connection.schema.hasTable(name).then((has_table) => {
            if (!has_table) {
                return connection.schema
                    .createTable(name, function (table) {
                        _.forEach(_.toPairs(schema), ([column, params]) => {
                            const { type, ...param } = params;
                            table[type](column, ..._.values(param));
                        });
                    })
                    .then(() => {
                        return { connection, name };
                    });
            } else {
                return { connection, name };
            }
        });
    };
}

function writeData(data, table) {
    const { name } = table;
    return function (connection) {
        return connection(name)
            .insert(data)
            .then(() => {
                return { connection, name };
            });
    };
}

function closeConnection(param) {
    const { connection, name } = param;
    connection.destroy();
    return name;
}

module.exports = {
    openConnection,
    createTable,
    closeConnection,
    writeData
};
