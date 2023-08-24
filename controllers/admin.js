const { 
    sequelize, 
    models: { 
        User, Admin, Otp,
        Order, Product, Category, 
        OrderContent, OrderDetail, ProductImage 
    } 
} = require('../models');
const {Op} = require('sequelize');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { generateOtp, getCurrentDateTime } = require('../util/helper');
const { createAccessToken } = require("../middleware/auth") ;
const ip = require("ip");
const axios = require("axios");
const UAParser = require("ua-parser-js");
require('dotenv').config();

exports.register = async(req, res) => {
    const { firstname, lastname, email, phone, password } = req.body;
    
    try{
        await sequelize.transaction(async function(transaction) {
            const admin = await Admin.create({
                firstname, lastname, email, phone, password
            }, {transaction});
        
            await Otp.create({ 
                otpable_id: admin.id,
                otpable_type: "admins",
                token: generateOtp(),
                purpose: "email_verification"
            }, {transaction});

            //create token
            const token = createAccessToken(admin);
            return res.status(201).json({
                message: 'Thanks for signing up! Please check your email to complete your registration.',
                results: token,
                error: false
            });
        });
    }catch(error){
        return res.status(500).json({
            message: "could not create account, please try again later",
            error: true
        });
    }

};

const getIpAddress = async(req) => {
    var address = ip.address();
    const userAgent = req.headers["user-agent"];
    const deviceDetails = parseUserAgent(userAgent);
    var response = await axios.get(`https://ipapi.co/${address}/json`);
    
    return {
        address: response.data,
        device: deviceDetails
    };
}

const parseUserAgent = (userAgent) => {
    const parser = new UAParser();
    const result = parser.setUA(userAgent).getResult();

    return {
        browser: result.browser.name,
        browserVersion: result.browser.version,
        os: result.os.name,
        osVersion: result.os.version,
        device: result.device.model || "Unknown"
    }
}

exports.login = async(req, res) => {
    const { email, password } = req.body;
    let admin = await Admin.findOne({
        where: {
            email: email,
        }
    });
    if(!admin || !(await bcrypt.compare(password, admin.password))){
        return res.status(400).json({
            message: "Wrong credentials",
            error: true
        });
    }else if(!admin.email_verified_at){
        return res.status(401).json({
            message: "Email address not verified, please verify your email before you can login",
            error: true
        });
    }else{
        /*const {address, device} = await getIpAddress(req);
        admin.login = {
            ip: address.ip,
            device: device,
            date: getCurrentDateTime()
        };
        await admin.save();*/
        req.session.user = admin;
        return res.status(200).json({
            message: 'Login successful',
            //results: {address, device},
            error: false
        });
    }
};

exports.getChartData = async(req, res) => {
    async function fetchOrdersByMonth(){
        var desiredYear = new Date().getFullYear();
        var desiredMonths = [1,2,3,4,5,6,7,8,9,10,11,12];
        var chartData = [];

        for(const month of desiredMonths){
            var order = await Order.count({
                where: {
                    createdAt: {
                        [Op.and]: [
                            {[Op.gte]: new Date(desiredYear, month - 1, 1)},
                            {[Op.lte]: new Date(desiredYear, month, 1)},
                        ]
                    }
                }
            });
            chartData.push(order);
        };
        return chartData;
    }
    var order = await fetchOrdersByMonth();
            
    async function fetchRevenueByMonth(){
        var desiredYear = new Date().getFullYear();
        var desiredMonths = [1,2,3,4,5,6,7,8,9,10,11,12];
        var chartData = [];

        for(const month of desiredMonths){
            var revenue = await Order.sum("total", {
                where: {
                    createdAt: {
                        [Op.and]: [
                            {[Op.gte]: new Date(desiredYear, month - 1, 1)},
                            {[Op.lte]: new Date(desiredYear, month, 1)},
                        ]
                    }
                }
            });
            (revenue == null) ? chartData.push(0) : chartData.push(revenue)
        };
        return chartData;
    }
    var revenue = await fetchRevenueByMonth();

    res.status(200).json({
        message: 'Orders:',
        results: {
            revenue: revenue,
            order: order
        },
        error: false
    });
    
}

exports.getStoreStatistics = async(req, res) => {
    var orders = await Order.count();
    var products = await Product.count();
    var categories = await Category.count();
    var users = await User.count();

    res.status(200).json({
        message: 'Store Statistics:',
        results: {
            "products": products,
            "orders": orders,
            "customers": users,
            "categories": categories
        },
        error: false
    });
}

exports.getOrders = async(req, res) => {
    const q = req.query.q;
    const page = req.query.page;
    switch(q){
        case "recent":
            var orders = await Order.findAll({
                limit: 5,
                order: [['createdAt', 'DESC']],
                include: [
                    {
                        model: User,
                        as: "user"
                    }
                ],
                raw: false
            });
            return res.status(200).json({
                message: 'Orders:',
                results: orders,
                error: false
            });
        break;
        case "all":
            const pageSize = 5;
            const offset = (page - 1) * pageSize;
            var orders = await Order.findAll({
                order: [['createdAt', 'DESC']],
                include: [
                    {
                        model: User,
                        as: "user"
                    }
                ],
                limit: pageSize,
                offset: offset,
                raw: false
            });

            var totalCount = await Order.count();
            var pages;
            if(totalCount <= pageSize){
                pages = 1;
            }else{
                pages = Math.ceil(totalCount / pageSize);
            }
            return res.status(200).json({
                message: 'Orders:',
                results: orders,
                pages: pages,
                error: false
            });
        break;
    }
}

exports.getProducts = async(req, res) => {
    const q = req.query.q;
    const page = req.query.page;
    switch(q){
        case "top":
            var orders = await OrderContent.findAll({
                attributes: [
                    "product_id",
                    [sequelize.fn("COUNT", sequelize.col("product_id")), "totalOrders"],
                    [sequelize.fn("SUM", sequelize.col("quantity")), "totalQuantity"]
                ],
                limit: 5,
                group: ["product_id"],
                order: [[sequelize.col('totalQuantity'), 'DESC']],
                include: [
                    {
                        model: Product,
                        as: "product",
                        include:[
                            {
                                model: ProductImage,
                                as: "images",
                                attributes: ['url']
                            }
                        ],
                    }
                ]
            });

            return res.status(200).json({
                message: 'Orders:',
                results: orders,
                error: false
            });  
        break;
        case "all":
            const pageSize = 10;
            const offset = (page - 1) * pageSize;
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
                limit: pageSize,
                offset: offset,
                order: [['createdAt', 'DESC']],
                raw: false
            });
            
            var totalCount = await Product.count();
            var pages;
            if(totalCount <= pageSize){
                pages = 1;
            }else{
                pages = Math.ceil(totalCount / pageSize);
            }
            return res.status(200).json({
                message: "Products:",
                results: products,
                pages: pages,
                error: false
            });
        break;
    }
}

exports.getOrder = async(req, res) => {
    var { id } = req.params;
    var order = await Order.findOne({
        where: {
            id: id
        }, 
        include:[
            {
                model: OrderDetail,
                as: "detail"
            },
            {
                model: OrderContent,
                as: "contents",
                attributes: ['id','price','quantity'],
                include:[
                    {
                        model: Product,
                        as: "product",
                        include:[
                            {
                                model: ProductImage,
                                as: "images",
                                attributes: ['url']
                            }
                        ],
                    }
                ]
            }
        ],
        raw: false
    });

    if(Object.is(order, null)){
        res.status(404).json({
            message: 'Order not found',
            results: order,
            error: true
        });
    }else{
        res.status(200).json({
            message: 'Order Details:',
            results: order,
            error: false
        });
    }
}

exports.dashboard = async(req, res) => {
    /*const user = req.session.user;
    let admin = await Admin.findOne({
        where: {
            email: req.session.user.email
        },
        raw: true
    });*/
   
    res.render('index', { admin: "gdgdgdg" });
}

exports.order = (req, res) => {
    res.render('orders');
}

exports.product = (req, res) => {
    res.render('products');
}

exports.customer = (req, res) => {
    res.render('customers');
}

exports.category = (req, res) => {
    res.render('categories');
}

exports.test = async(req, res) => {
    const date = new Date("2023-08-15 13:16:50");
      const months = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December'
      ];
      const day = date.getDate();
      const month = months[date.getMonth()];
      const year = date.getFullYear();

    return res.json(`${day}, ${month} ${year}`);
}

exports.getUsers = async(req, res) => {
    const page = req.query.page;
    const pageSize = 5;
    const offset = (page - 1) * pageSize;
    let users = await User.findAll({ 
        limit: pageSize,
        offset: offset,
        raw: false
    });
    
    var totalCount = await User.count();
    var pages;
    if(totalCount <= pageSize){
        pages = 1;
    }else{
        pages = Math.ceil(totalCount / pageSize);
    }
    return res.status(200).json({
        message: "Users:",
        results: users,
        pages: pages,
        error: false
    });
}