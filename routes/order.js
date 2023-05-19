const express = require('express');
const router = express.Router();
const order = require('../controllers/order');
const { isAuthenticated } = require("../middleware/auth") ;
//const { createOrderSchema } = require('../schemas/auth');

router.post('/', isAuthenticated, order.order);
router.post('/send-invoice', isAuthenticated, order.sendInvoice);

module.exports = router;