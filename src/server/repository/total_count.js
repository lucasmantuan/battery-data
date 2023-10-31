const _ = require('lodash');
const connection = require('../../database-server/connection');

async function totalCount(profile) {
    try {
        const [{ total_count }] = await connection('battery')
            .where('profile', 'like', `%${profile}%`)
            .count('* as total_count');

        if (_.isInteger(_.toNumber(total_count))) {
            return _.toNumber(total_count);
        }
    } catch (error) {
        return new Error('erro ao consultar o total de registros');
    }
}

module.exports = { totalCount };
