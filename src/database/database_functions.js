const _ = require('lodash');
const knex = require('knex');
const { global_parameters } = require('../utils/global_parameters');

/**
 * Cria uma conexão com o banco de dados usando os parametros fornecidos.
 *
 * @param {Object} connection_config
 * Objeto com as configurações de conexão com o banco de dados.
 *
 * @returns {Promise}
 * Promise que retolve para um objeto com a conexão com o banco de dados.
 */
function openConnection(connection_config) {
    return new Promise((resolve) => {
        const connection = knex(connection_config);
        resolve(connection);
    });
}

/**
 * Retorna uma função que cria uma tabela no banco de dados com o nome e os parâmetros fornecidos.
 *
 * @param {Object} param
 * Objeto com as informações necessárias para a criação da tabela.
 *
 * @param {string} param.name
 * Nome da tabela que será criada.
 *
 * @param {Object} param.schema
 * Parâmetros para a criação da tabela.
 *
 * @returns {(connection: Object) => Promise}
 * Função que cria a tabela no banco de dados.
 */
function createTable(param) {
    const { table, schema } = param;
    /**
     * Função que cria a tabela no banco de dados se ela ainda não foi criada.
     *
     * @param {Object} connection
     * Objeto com a conexão para o banco de dados.
     *
     * @returns {Promise<Object> | Object}
     * Promise que resolve para um objeto com a conexão com o banco de dados
     * e o nome da tabela utilizada ou objeto com a conexão com o banco
     * de dados e o nome da tabela.
     */
    return function (connection) {
        return connection.schema.hasTable(table).then((has_table) => {
            if (!has_table) {
                return connection.schema
                    .createTable(table, function (table) {
                        _.forEach(_.toPairs(schema), ([column, params]) => {
                            const { type, ...param } = params;
                            table[type](column, ..._.values(param));
                        });
                    })
                    .then(() => {
                        return { connection, table };
                    });
            } else {
                return { connection, table };
            }
        });
    };
}

/**
 * Função que grava os dados no banco de dados.
 *
 * @param {Array} data
 * Array com os dados para inserção no banco de dados.
 *
 * @param {Object} table
 * Objeto com o nome da tabela para inserção dos dados.
 *
 * @returns {(connection: Object) => Promise}
 * Função que recebe um objeto com a conexão com o banco de dados e retorna uma Promise
 * que resolve para um objeto com a conexão o nome da tabela utilizada.
 */
function writeData(data, table) {
    const { name } = table;
    /**
     * Função que insere os dados na tabela especificada no banco de dados.
     *
     * @param {Object} connection
     * Objeto com a conexão para o banco de dados.
     *
     * @returns {Promise}
     * Promise que resolve para um objeto com a conexão
     * com o banco de dados e o nome da tabela utilizada.
     */
    return function (connection) {
        return connection(name)
            .insert(data)
            .then(() => {
                return {
                    connection,
                    table: name,
                    file: { name: global_parameters.file_name.toString(), records: data.length }
                };
            });
    };
}

/**
 * Fecha a conexão com o banco de dados retornando o nome da tabela utilizada.
 *
 * @param {Object} param
 * Objeto com os parametros para fechar a conexão.
 *
 * @param {Object} param.connection
 * Objeto com a conexão com o banco de dados.
 *
 * @param {string} param.name
 * O nome da tabela utilizada.
 *
 * @returns {string}
 * Retorna o nome da tabela utilizada.
 */
function closeConnection(param) {
    const { connection, table, file } = param;
    connection.destroy();
    return { table, file };
}

module.exports = {
    closeConnection,
    createTable,
    openConnection,
    writeData
};
