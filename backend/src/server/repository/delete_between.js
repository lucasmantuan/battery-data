const { connection } = require('../../database/database');

async function deleteBetween(profile, date) {
    try {
        const { start, end } = date;

        const deleted_records = await connection('battery')
            .whereBetween('date_time', [start, end])
            .andWhere({ profile })
            .del();

        const result = { profile, start, end, records: deleted_records };

        return result;
    } catch (error) {
        return new Error('erro ao consultar os registros');
    }
}

module.exports = { deleteBetween };
