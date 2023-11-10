const { create, upload } = require('./create');
const { getAll } = require('./get_all');
const { getLog } = require('./get_log');

const BatteryController = { create, getAll, getLog, upload };

module.exports = BatteryController;
