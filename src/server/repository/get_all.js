const _ = require('lodash');
const connection = require('../../database-server/connection');

async function getAll(page, limit, profile, date) {
    try {
        const { start, end } = date;

        const date_time = function () {
            if (!_.isEmpty(start) && !_.isEmpty(end)) {
                this.whereRaw('date_time between ? and ?', [start, end]);
            }
        };

        const result = await connection('battery')
            .select('*')
            .where('profile', 'like', `%${profile}%`)
            .where(date_time)
            .offset((page - 1) * limit)
            .limit(limit);

        return result;
    } catch (error) {
        return new Error('erro ao consultar os registros');
    }
}

module.exports = { getAll };
