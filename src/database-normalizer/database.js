const { stringifyObject } = require('../utils/utils');
const { openConnection, createTable, writeData, closeConnection } = require('./database_functions');
require('dotenv').config();

const connection_config = {
    client: process.env.DATABASE_CLIENT,
    connection: {
        host: process.env.DATABASE_HOST,
        port: process.env.DATABASE_PORT,
        user: process.env.DATABASE_USER,
        database: process.env.DATABASE_NAME,
        password: process.env.DATABASE_PASSWORD
    }
};

/**
 * Grava os dados no banco de dados na table especificada nos parametros.
 *
 * @param {Array} data
 * Array contendo os dados a serem gravados no banco de dados.
 *
 * @param {Object} profile
 * Objeto contendo as informações de conexão com o banco de dados.
 *
 * @returns {Promise}
 * Promise que resolve informando quando os dados foram gravados no banco de dados.
 */
function database(data, profile) {
    const { table } = profile.database;
    openConnection(connection_config)
        .then(writeData(data, table))
        .then(closeConnection)
        .then((result) => process.stdout.write(stringifyObject(result)));
    return;
}

/**
 * Cria uma tabela no banco de dados com os parametros especificados.
 *
 * @param {Object} profile
 * Objeto contendo as informações de conexão com o banco de dados.
 *
 * @returns {Promise}
 * Promise que resolve informando quando a tabela foi criada no banco de dados.
 */
function create(profile) {
    const { table } = profile.database;
    openConnection(connection_config).then(createTable(table)).then(closeConnection);
    return;
}

module.exports = {
    database,
    create
};
