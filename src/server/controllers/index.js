const { create, upload } = require('./create');
const { getAll } = require('./get_all');

const BatteryController = { create, getAll, upload };

module.exports = BatteryController;
