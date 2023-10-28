const { create } = require('./create');
const { getAll } = require('./get_all');
const { totalCount } = require('./total_count');

const BatteryProvider = { create, getAll, totalCount };

module.exports = BatteryProvider;
