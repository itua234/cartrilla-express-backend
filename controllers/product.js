const Joi = require('joi');
const jwt = require('jsonwebtoken');
const { sequelize, models: { User, Product, ProductImage, Category } } = require('../models');
const http = require('https');
const {Op} = require('sequelize');
const fs = require("fs");
const path = require("path");
require('dotenv').config();
   
exports.create = async(req, res) => {
    const { 
        name, price, stock, 
        brand, description, 
        category_id, images
    } = req.body;

    const product = await Product.create({
        name, 
        price, 
        stock, 
        brand, 
        description, 
        category_id
    });
    
    images.forEach(async(image) => {
        await ProductImage.create({
            product_id: product.uuid,
            url: "/images/uploads/" + image.filename
        });
    });

    return res.status(200).json({
        message: "new product has been added",
        results: product,
        error: false
    });
}

exports.update = async(req, res) => {
    const { id } = req.params;
    var product = await Product.findOne({
        where: {
            uuid: id
        }
    });
    if(!product){
        return res.status(404).json({
            message: "Product not found",
            results: null,
            error: true
        });
    }

    const params = req.body;
    const saveData = async () => {
        Object.keys(params).forEach(async(param) => {
            if(param != "images"){
                product[param] = params[param]
            }
        });
        await product.save();
    }

    saveData().then(() => {
        let images = params["images"];
        if(images.length !== 0){
            images.forEach(async(image) => {
                await ProductImage.create({
                    product_id: product.uuid,
                    url: "/images/uploads/" + image.filename
                });
            });
        }

        return res.status(200).json({
            message: "product details has been updated",
            results: product,
            error: false
        });
    });
}

exports.getProductDetails = async(req, res) => {
    var { id } = req.params;
    var product = await Product.findOne({
        where: {
            uuid: id
        }, 
        include:[
            {
                model: ProductImage,
                as: "images",
                attributes: ['id','url']
            },
            {
                model: Category,
                as: "category",
                attributes: ['id', 'name']
            }
        ],
        raw: false
    });
    if(!product){
        return res.status(404).json({
            message: "Product not found",
            results: null,
            error: true
        });
    }else{
        return res.status(200).json({
            message: "Product Details:",
            results: product,
            error: false
        });
    }
}

exports.delete = async(req, res) => {
    var { id } = req.params;
    let product = await Product.findOne({
        where: {
            uuid: id
        }
    });
    if(!product){
        return res.status(404).json({
            message: "Product not found",
            results: null,
            error: true
        });
    }
    
    let images = await ProductImage.findAll({
        where: {
            product_id: product.uuid
        }
    });
    
    if(images.length !== 0){
        images.forEach(async(image) => {
            await image.destroy();
            //url: "/images/uploads/" + image.filename
            const filename = image.url.slice(16);
            const filePath = path.join(__dirname, "..", "public", "images", "uploads", filename);

            //Check if the file exists
            if(fs.existsSync(filePath)){
                //Delete the file
                fs.unlinkSync(filePath);
            }
        });
    }

    await product.destroy();

    return res.status(200).json({
        message: "product has been deleted",
        results: null,
        error: false
    });
}

exports.deleteProductImage = async(req, res) => {
    var { id } = req.params;
    let image = await ProductImage.findOne({
        where: {
            id: id
        }
    });
    if(!image){
        return res.status(404).json({
            message: "Image not found",
            results: null,
            error: true
        });
    }
    
    await image.destroy();
    //url: "/images/uploads/" + image.filename
    const filename = image.url.slice(16);
    const filePath = path.join(__dirname, "..", "public", "images", "uploads", filename);

    //Check if the file exists
    if(fs.existsSync(filePath)){
        //Delete the file
        fs.unlinkSync(filePath);
    }

    return res.status(200).json({
        message: "image has been deleted",
        results: null,
        error: false
    });
}

exports.getCategories = async(req, res) => {
    const categories = await Category.findAll({
        attributes: {
            exclude: ['slug', 'description', 'image']
        },
        //order: [["name", "DESC"]]
    });
    
    return res.status(200).json({
        message: "Categories:",
        results: categories,
        error: false
    });
}

exports.createCategories = async(req, res) => {
    const params = req.body;
    const category = Category.build({});
    
    const saveData = async () => {
        Object.keys(params).forEach(async(param) => {
            category[param] = params[param];
        });
        await category.save();
    }

    saveData().then(() => {
        return res.status(200).json({
            message: "a new category has been created",
            results: category,
            error: false
        });
    });
}

exports.review = async(req, res) => {
    var { categoryId } = value;
    let product = await Product.findAll({
        where: {
            category_id: categoryId
        }, 
        include:[
            {
                model: ProductImage,
                as: "images",
                attributes: ['id', 'url']
            }
        ],
        raw: false
    });
    if(!product){
        return res.status(404).json({
            message: "Products not found",
            results: null,
            error: true
        });
    }else{
        return res.status(200).json({
            message: "Product Details:",
            results: product,
            error: false
        });
    }
}

exports.getSimilarProducts = async(req, res) => {
    var { categoryId, productId } = req.params;
    let products = await Product.findAll({
        where: {
            category_id: categoryId,
            uuid: {[Op.not]: productId}
        }, 
        include:[
            {
                model: ProductImage,
                as: "images",
                attributes: ['id', 'url']
            }
        ],
        raw: false
    });
    
    return res.status(200).json({
        message: "Product Details:",
        results: products,
        error: false
    });
}

exports.getAllProducts = async(req, res) => {
    let products = await Product.findAll({ 
        include:[
            {
                model: ProductImage,
                as: "images",
                attributes: ['url']
            },
            {
                model: Category,
                as: "category",
                attributes: ['id', 'name']
            }
        ],
        limit: 10,
        raw: false
    });
    
    return res.status(200).json({
        message: "Products:",
        results: products,
        error: false
    });
}

exports.FetchTrendingProducts = async(req, res) => {
    
}

exports.FetchProductsByPrice = async(req, res) => {
    var { min, max } = req.params;
    let products = await Product.findAll({ 
        where: {
            price: {
                $between: [min, max]
            }
        },
        include: [
            {
                model: ProductImage,
                as: "images",
                attributes: ['id', 'url']
            },
            {
                model: Category,
                attributes: ['id', 'name', 'image']
            }
        ],
        raw: false
    });
    
    return res.status(200).json({
        message: "Products:",
        results: products,
        error: false
    });
}

exports.createTestProducts = async(req, res) => {
    return res.json('you want to create products');
    const options = {
        hostname: 'dummyjson.com',
        port: 443,
        path: '/products?limit=20',
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    }
    const request = http.request(options, (response) => {
        let data = '';
        response.on('data', chunk => {
            data += chunk;
        })
        response.on('end', () => {
            result = JSON.parse(data);
            let products = result.products;
            //res.send(products);
            //await sequelize.transaction(async function(transaction) {
                products.forEach( async(product) => {
                    const name = product.title;
                    var brand = product.brand;
                    var stock = product.stock;
                    var price = product.price;
                    var description = product.description;
                    var shipping_cost = Math.floor(Math.random() * (500 - 200) + 200);
                    var images = product.images;
                    var category = await Category.findOne({
                        where: {name: product.category}, raw: true
                    });

                    product = await Product.create({
                        category_id: parseInt(category.id),
                        name: name,
                        brand: brand,
                        stock: parseInt(stock),
                        price: parseInt(price),
                        description: description,
                        shipping_cost: parseInt(shipping_cost),
                    });
            
                    images.forEach( async(url) => {
                        await ProductImage.create({
                            url: url,
                            product_id: product.uuid
                        });
                    });
                });
                res.send(products.length + " products has been created");
            });
        //})
    }).on('error', e => {
        res.send(e);
    })
    request.end();
}

