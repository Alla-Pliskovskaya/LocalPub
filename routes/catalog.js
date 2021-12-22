let express = require('express');
let router = express.Router();

let homeController = require('../controllers/homeController');
let waiterController = require('../controllers/waiterController');
let timeTableController = require('../controllers/timetableController');
let tableController = require('../controllers/tableController');

router.get('/', homeController.index);

router.get('/waiter', waiterController.waiter_list);

router.get('/table', tableController.table_list);

router.get('/time_table', timeTableController.time_table_list);
router.post('/time_table', timeTableController.time_table_reserve)

module.exports = router;