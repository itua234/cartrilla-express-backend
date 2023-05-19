const express = require('express');
const router = express.Router();
const user = require('../controllers/user');
const { isAuthenticated } = require("../middleware/auth");
const { userProfileSchema } = require('../schemas/user');

router.get('/', isAuthenticated, user.getUser);
router.get('/states', user.getStates);
router.get('/address/shipping', isAuthenticated, user.getShippingAddress);
router.get('/address/billing', isAuthenticated, user.getBillingAddress);
router.post('/profile', [isAuthenticated, userProfileSchema], user.updateUserDetails);

module.exports = router;