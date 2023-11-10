const { create } = require('./create');
const { getAll } = require('./get_all');
const { getLog } = require('./get_log');
const { totalCount } = require('./total_count');

const BatteryProvider = { create, getAll, getLog, totalCount };

module.exports = BatteryProvider;
