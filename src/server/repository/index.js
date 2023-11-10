const { create } = require('./create');
const { deleteBetween } = require('./delete_between');
const { getAll } = require('./get_all');
const { getLog } = require('./get_log');
const { totalCount } = require('./total_count');

const BatteryProvider = { create, deleteBetween, getAll, getLog, totalCount };

module.exports = BatteryProvider;
