const express = require('express');
const router = express.Router();
const auth = require('../controllers/auth');
const user = require('../controllers/user');
const order = require('../controllers/order');
const product = require('../controllers/product');
const { isAuthenticated, isCartrilla } = require("../middleware/auth") ;
const { 
    registerSchema, 
    loginSchema, 
    verifyEmailSchema, 
    forgotPasswordSchema,
    verifyForgotPasswordTokenSchema,
    resetPasswordSchema
} = require('../schemas/auth');

const { profileSchema } = require('../schemas/user');

const { orderSchema } = require('../schemas/order');

router.post('/auth/register/', [registerSchema], auth.register);
router.post('/auth/login', [loginSchema], auth.login);
router.get('/auth/logout', [isAuthenticated], auth.logout);
router.post('/auth/email/verify/:email/:token/', [verifyEmailSchema], auth.verifyEmail);
router.get('/auth/verify/reset/token/:email/:token', [verifyForgotPasswordTokenSchema], auth.verifyForgotPasswordToken);
router.post('/auth/password/forgot', [forgotPasswordSchema], auth.forgotPassword);
router.post('/auth/password/reset', [resetPasswordSchema], auth.resetPassword);
//router.post('/change-password', [isAuthenticated], auth.changePassword);

router.get('/user/', isAuthenticated, user.getUser);
router.get('/user/states', user.getStates);
router.get('/user/address/shipping', isAuthenticated, user.getShippingAddress);
router.get('/user/address/billing', isAuthenticated, user.getBillingAddress);
router.post('/user/profile', [isAuthenticated, profileSchema], user.updateUserDetails);
router.get('/user/cards', isAuthenticated, user.getUserCards);

router.post('/product/create', isAuthenticated, product.create);
router.get('/product/:id', product.show);
router.get('/product/:productId/:categoryId', product.getSimilarProducts);
router.get('/product/', product.FetchAllStoreProducts);
router.get('/product/trending', product.FetchTrendingProducts);
router.get('/product/:min/:max', product.FetchProductsByPrice);

router.get('/category', isAuthenticated, product.getCategories);
router.post('/category', isAuthenticated, product.createCategories);
router.get('/category/:categoryId/products', isAuthenticated, product.getProducts);

router.post('/order/', [isAuthenticated, orderSchema], order.order);
router.get('/order/:id', isAuthenticated, order.getOrder);
router.get('/order/', isAuthenticated, order.getUserOrders);
router.post('/order/verify/:reference', isAuthenticated, order.verifyOrder);

module.exports = router;