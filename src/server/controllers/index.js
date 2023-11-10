const { create, upload } = require('./create');
const { deleteBetween } = require('./delete_between');
const { getAll } = require('./get_all');
const { getLog } = require('./get_log');

const BatteryController = { create, deleteBetween, getAll, getLog, upload };

module.exports = BatteryController;
