const express = require('express');
const router = express.Router();
const product = require('../controllers/product');
const { isAuthenticated } = require("../middleware/auth") ;

router.post('/create', isAuthenticated, product.create);
router.get('/:id', product.show);
router.get('/:productId/:categoryId', product.getSimilarProducts);
router.get('/', product.FetchAllStoreProducts);
router.get('/trending', product.FetchTrendingProducts);
router.get('/:min/:max', product.FetchProductsByPrice);
router.get('/create-test-products', product.createTestProducts);

module.exports = router;