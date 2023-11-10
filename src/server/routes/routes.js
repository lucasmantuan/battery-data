const router = require('express').Router();
const BatteryController = require('../controllers/index');

router.get('/battery', BatteryController.getAll);
router.get('/battery/log/:date', BatteryController.getLog);
router.post('/battery', BatteryController.upload.array('files'), BatteryController.create);

module.exports = router;
