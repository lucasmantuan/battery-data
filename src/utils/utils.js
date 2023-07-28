const _ = require('lodash');
const path = require('path');

function parseToObject(data) {
    return JSON.parse(data);
}

function getFileName(data) {
    return _.map(data, (file_name) => path.basename(file_name));
}

module.exports = { parseToObject, getFileName };
