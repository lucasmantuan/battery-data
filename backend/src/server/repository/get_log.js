const _ = require('lodash');
const fs = require('fs');

async function getLog(date) {
    try {
        const path = `${process.env.PATH_LOGS}/${date}.csv`;
        const file = fs.readFileSync(path, 'utf8');
        const file_rows = _.map(_.slice(_.split(file, '\n'), 1, -1), (item) => _.split(item, ';'));
        const file_header = _.split(_.split(file, '\n')[0], ';');
        const rows = _.map(file_rows, (row) => _.map(row, (item) => _.trim(item)));
        const header = _.map(file_header, (item) => _.trim(item));
        const result = _.map(rows, (row) => _.zipObject(header, row));
        return result;
    } catch (error) {
        return new Error('erro ao consultar o log');
    }
}

module.exports = { getLog };
