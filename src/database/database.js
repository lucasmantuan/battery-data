const { openConnection, createTable, writeData, closeConnection } = require('./database_functions');
const { recordLog } = require('../normalizer/normalize_functions');

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
    const { connection, table } = profile.database;
    openConnection(connection)
        .then(writeData(data, table))
        .then(recordLog)
        .then(closeConnection)
        .catch(recordLog);
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
    const { connection, table } = profile.database;
    openConnection(connection).then(createTable(table)).then(closeConnection);
    return;
}

module.exports = {
    create,
    database
};
