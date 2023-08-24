const express = require('express');
const router = express.Router();
const auth = require('../controllers/auth');
const user = require('../controllers/user');
const order = require('../controllers/order');
const product = require('../controllers/product');
const admin = require('../controllers/admin');
const { isAuthenticated, isCartrilla } = require("../middleware/auth") ;
const { 
    registerSchema, 
    loginSchema, 
    verifyEmailSchema, 
    forgotPasswordSchema,
    verifyForgotPasswordTokenSchema,
    resetPasswordSchema
} = require('../schemas/auth');

const { 
    profileSchema, 
    updateBillingSchema,
    updateShippingSchema
} = require('../schemas/user');

const { orderSchema } = require('../schemas/order');
const { 
    createProductSchema, 
    updateProductSchema , 
    createCategorySchema
} = require('../schemas/product');

const multer = require('multer');
const upload = multer({
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, 'public/images/uploads')
        },
        filename: (req, file, cb) => {
            console.log(file);
            cb(null, Date.now() + '-' + file.originalname)
        }
    }),
    fileFilter: (req, file, cb) => {
        if(file.mimetype === "image/jpeg" ||
            file.mimetype === "image/jpg" ||
            file.mimetype === "image/png" ||
            file.mimetype === "image/svg"
        ){
            cb(null, true);
        }else{
            cb(null, false);
        }
    },
    limits: {
        fileSize: 2 * 1024  * 1024, //2MB
        files: 3
    }
});

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
router.post('/user/address/shipping', [isAuthenticated, updateShippingSchema], user.updateShippingAddress);
router.post('/user/address/billing', [isAuthenticated, updateBillingSchema], user.updateBillingAddress);
router.post('/user/profile', [isAuthenticated, profileSchema], user.updateUserDetails);
router.get('/user/cards', isAuthenticated, user.getUserCards);

router.route('/product')
.get(product.getAllProducts)
.post([upload.array('images'), createProductSchema], product.create)

router.route('/product/:id')
.get(product.getProductDetails)
.post([upload.array('images')], updateProductSchema, product.update)
.delete(product.delete);

router.get('/product/:productId/:categoryId', product.getSimilarProducts);
router.get('/product/trending', product.FetchTrendingProducts);
router.get('/product/:min/:max', product.FetchProductsByPrice);

router.route('/category')
.get(product.getCategories)
.post(createCategorySchema, product.createCategories);

router.route('/order')
.get(isAuthenticated, order.getUserOrders)
.post([isAuthenticated, orderSchema], order.order);

router.route('/order/:id')
.get(isAuthenticated, order.getOrder);
//.post([isAuthenticated, orderSchema], order.updateOrder);
router.post('/order/verify/:reference', isAuthenticated, order.verifyOrder);

router.get("/check", function(req, res){
    from = Math.floor(new Date("2023-08-10").getTime() / 1000);
    return res.json(from);
});

router.get('/admin/orders/chart-data', admin.getChartData);

router.route('/admin/users')
.get(admin.getUsers);

router.route('/admin/orders')
.get(admin.getOrders);

router.route('/admin/order/:id')
.get(admin.getOrder);

router.route('/admin/products')
.get(admin.getProducts)

router.get('/admin/store-statistics', admin.getStoreStatistics);

module.exports = router;