const knex = require('knex');

function abrirConexao(configuracao) {
    return new Promise((resolve, reject) => {
        try {
            const conexao = knex(configuracao);
            resolve(conexao);
        } catch (error) {
            reject(error);
        }
    });
}

function fecharConexao({ conexao }) {
    return conexao.destroy();
}

function criarTabela(nomeTabela, configuracaoTabela) {
    return function (conexao) {
        return conexao.schema.hasTable(nomeTabela).then((existe) => {
            if (!existe) {
                return conexao.schema
                    .createTable(nomeTabela, (table) => {
                        Object.entries(configuracaoTabela).forEach(([coluna, config]) => {
                            const { type, ...opcoes } = config;
                            table[type](coluna, ...Object.values(opcoes));
                        });
                    })
                    .then(() => {
                        return { conexao, nomeTabela };
                    });
            } else {
                return { conexao, nomeTabela };
            }
        });
    };
}

function gravarRegistros(registros) {
    return function ({ conexao, nomeTabela }) {
        return conexao(nomeTabela)
            .insert(registros)
            .then(() => {
                return { conexao, nomeTabela };
            });
    };
}

module.exports = {
    abrirConexao,
    fecharConexao,
    criarTabela,
    gravarRegistros
};
