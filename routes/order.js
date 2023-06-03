const express = require('express');
const router = express.Router();
const order = require('../controllers/order');
const { isAuthenticated } = require("../middleware/auth") ;
const { orderSchema } = require('../schemas/order');

router.post('/', [isAuthenticated, orderSchema], order.order);
router.get('/:id', isAuthenticated, order.getOrder);
router.get('/', isAuthenticated, order.getUserOrders);
router.post('/verify/:reference', isAuthenticated, order.verifyOrder);

module.exports = router;