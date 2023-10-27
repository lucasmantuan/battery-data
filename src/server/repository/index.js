const { getAll } = require('./get_all');
const { totalCount } = require('./total_count');

const BatteryProvider = { totalCount, getAll };

module.exports = BatteryProvider;
