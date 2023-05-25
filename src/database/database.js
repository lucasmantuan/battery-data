const { abrirConexao, criarTabela, fecharConexao, gravarRegistros } = require('./database_functions.js');

module.exports = function database(data) {
    abrirConexao({
        client: 'mysql2',
        connection: {
            host: 'localhost',
            port: 3306,
            user: 'root',
            password: 'lucas',
            database: 'battery'
        }
    })
        .then(
            criarTabela('data', {
                date: {
                    type: 'datetime'
                },
                test: {
                    type: 'decimal',
                    precision: 12,
                    scale: 6
                },
                cyst: {
                    type: 'integer'
                }
            })
        )
        .then(gravarRegistros(data))
        .then(fecharConexao);
};
