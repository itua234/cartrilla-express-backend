const { auth } = require("../middleware/auth") ;
const { 
    sequelize, 
    models: { User, Order, Product, OrderContent, OrderDetail, ProductImage, UserCard } 
} = require('../models');
const { generateReference } = require('../util/helper');
const { getPaymentData } = require('../util/payment');
const http = require('https');
require('dotenv').config();

exports.order = async(req, res) => {
    var user = auth(req);
    var reference = generateReference(user.id);
    var total = req.body.total;
    var orderNo = Math.floor(Math.random() * (9999 - 1000) + 1000);
    var cart = req.body.cart;

    try{
        sequelize.transaction(async function(transaction) {
            var order = await Order.create({
                user_id: user.id,
                order_no: orderNo,
                subtotal: req.body.subtotal,
                shipping_cost: req.body.shipping_cost,
                total: total,
                reference: reference,
                coupon_code: !Object.is(req.body.coupon_code, null) ? req.body.coupon_code : null
            }, {transaction});

            cart.forEach(myFunction);
            async function myFunction(item){
                await OrderContent.create({
                    order_id: order.id,
                    product_id: item.uuid,
                    quantity: item.quantity,
                    price: item.price
                });
            }
            
            let detail = await OrderDetail.create({
                order_id: order.id,
                firstname: req.body.firstname,
                lastname: req.body.lastname,
                phone: req.body.phone,
                email: req.body.email,
                city: req.body.city,
                state: req.body.state,
                street: req.body.street
            }, { transaction });
            
            res.status(201).json({
                message: 'Order:',
                results: {'order': order, 'detail': detail},
                error: false
            });
        });
    }catch(error){
        return res.status(500).json({
            message: "could not create order, please try again later",
            error: true
        });
    }

};

exports.verifyOrder = async(req, res) => {
    var user = auth(req);
    var { reference } = req.params;
    var order = await Order.findOne({
        where: {reference}
    });

    if(Object.is(order, null)){
        res.status(422).json({
            message: 'Order reference verification failed',
            results: order,
            error: true
        });
    }else{
        getPaymentData(reference)
        .then(data => {
            let result = JSON.parse(data);
            let channel = result.data.channel;
            let authorization = result.data.authorization;
            authorization.user_id = user.id;
            async function updateOrder(){
                order.payment_status = result.data.status;
                order.payment_channel = channel;
                order.verified = true;
                order.amount_paid = result.data.amount / 100;
                await order.save();

                // if(channel == "card"){
                //     await UserCard.create(
                //         authorization
                //     );
                // }
            };
            updateOrder();
            
            return res.status(200).json({
                message: 'Order reference verification successful',
                results: order,
                error: false
            });
        }).catch(err => {
            return res.status(500).json({
                message: 'Order verification failed',
                results: err,
                error: true
            });
        });
    }

}

exports.getOrder = async(req, res) => {
    var { id } = req.params;
    var order = await Order.findOne({
        where: {
            id: id
        },
        attributes: ['total'], 
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

exports.getUserOrders = async(req, res) => {
    var user = auth(req);
    var order = await Order.findAll({
        where: {
            user_id: user.id
        }, 
        include:[
            {
                model: OrderDetail,
                as: "detail"
            }
        ],
        raw: false
    });

    res.status(200).json({
        message: 'Orders:',
        results: order,
        error: false
    });
}