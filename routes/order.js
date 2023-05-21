const express = require('express');
const router = express.Router();
const order = require('../controllers/order');
const { isAuthenticated } = require("../middleware/auth") ;
//const { createOrderSchema } = require('../schemas/auth');

router.post('/', isAuthenticated, order.order);
router.get('/:id', isAuthenticated, order.getOrder);
router.get('/', isAuthenticated, order.getUserOrders);
router.post('/verify/:reference', isAuthenticated, order.verifyOrder);
router.post('/send-invoice', isAuthenticated, order.sendInvoice);

module.exports = router;