const knex = require('knex');

const config = {
    client: 'mysql2',
    connection: {
        host: '172.22.210.211',
        port: 3306,
        user: 'root',
        password: 'lucas',
        database: 'lucas'
    }
};

const connection = knex(config);

module.exports = connection;
