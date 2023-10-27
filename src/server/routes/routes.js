const BatteryController = require('../controllers/index');
const router = require('express').Router();

router.get('/battery', BatteryController.getAll);
// router.post('/battery', BatteryController.create);

module.exports = router;
