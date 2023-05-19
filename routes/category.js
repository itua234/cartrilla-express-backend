const express = require('express');
const router = express.Router();
const product = require('../controllers/product');
const { isAuthenticated } = require("../middleware/auth") ;

// router.post('/create', isAuthenticated, product.create);
// router.get('/:id', isAuthenticated, product.show);
// router.get('/create-test-products', product.createTestProduct);
router.get('/', isAuthenticated, product.getCategories);
router.post('/', isAuthenticated, product.createCategories);
router.get('/:categoryId/products', isAuthenticated, product.getProducts);

module.exports = router;