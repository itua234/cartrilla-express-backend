const { auth } = require("../middleware/auth") ;
const { sequelize, models: { User, Order, Address, Product, OrderContent } } = require('../models');
const { generateReference } = require('../util/helper');
const { getBankList, intitializeTransaction } = require('../util/payment');
const http = require('https');
require('dotenv').config();

exports.order = async(req, res) => {
    var user = auth(req);
    var reference = generateReference(user.id);
    var total = req.body.total;
    var channel = req.body.channel.toUpperCase();
    var orderNo = Math.floor(Math.random() * (9999 - 1000) + 1000);
    var cart = req.body.cart;

    intitializeTransaction({
        "email": user.email,
        "amount": total,
        "reference": reference,
    }).then(data => {
        result = JSON.parse(data);

        try{
        sequelize.transaction(async function(transaction) {
            var order = await Order.create({
                user_id: user.id,
                order_no: orderNo,
                subtotal: req.body.subtotal,
                shipping_cost: req.body.shipping_cost,
                subcharge: req.body.subcharge,
                total: total,
                reference: reference,
                payment_channel: channel,
                coupon_code: !Object.is(req.body.coupon_code, null) ? req.body.coupon_code : null
            }, {transaction});

            var array = [];
            cart.forEach(myFunction);
            async function myFunction(item){
                var product = await Product.findOne({
                    where: {id: item.id},raw: true
                }, {transaction});
                var itemId = item.id;
                var price = item.price;
                var quantity = item.quantity;
                var total = price * quantity;

                if(array.includes(product.seller_id)){
                    var subOrder = await SubOrder.findOne({
                        where: {order_no: orderNo, seller_id: product.id},raw: true
                    });
                    await OrderContent.create({
                        sub_order_id: subOrder.id,
                        product_id: itemId,
                        quantity: quantity,
                        price: price
                    });
                    SubOrder.total += total;
                    await SubOrder.save();
                }else{
                    var sub = await SubOrder.create({
                        seller_id: product.seller_id,
                        order_id: order.id,
                        order_no: orderNo,
                        total: total,
                    });
                    await OrderContent.create({
                        sub_order_id: sub.id,
                        product_id: itemId,
                        quantity: quantity,
                        price: price
                    });
                }
                
                array.push(product.seller_id);
            }
            
            await Address.create({
                order_id: order.id,
                city: req.body.address.city,
                state: req.body.address.state,
                street: req.body.address.street
            }, { transaction });
            res.status(201).json({
                message: 'Payment Link:',
                results: result.data.authorization_url,
                error: false
            });
        });
        }catch(error){
            res.send(error);
        }
    }).catch(err => {
        return res.status(500).json({
            message: "could not create order, please try again later",
            error: true
        });
    });

};

exports.sendInvoice = async(req, res) => {
    var user = auth(req);
    var cart = req.body.cart;
    var product = await Product.findOne({
        where: {id: cart.id},raw: true
    });
    var price = cart.price;
    var quantity = !Object.is(cart.quantity, null) ? cart.quantity : 1;
    var buyer = await User.findOne({
        where: {
            id: req.body.id
        },
        raw: true
    });
    subcharge = 500;

    var subtotal = price * quantity;
    var total = 0;
    total += parseInt(product.shipping_cost);
    total += subcharge;
    total += subtotal;
    var reference = generateReference(user.id);
    var orderNo = Math.floor(Math.random() * (9999 - 1000) + 1000);
    
    try{
        await sequelize.transaction(async function(transaction) {
            var order = await Order.create({
                user_id: buyer.id,
                order_no: orderNo,
                subtotal: subtotal,
                shipping_cost: product.shipping_cost,
                subcharge: subcharge,
                total: total,
                reference: reference,
            }, {transaction});

            var sub = await SubOrder.create({
                seller_id: product.seller_id,
                order_id: order.id,
                order_no: orderNo,
                total: total,
            }, { transaction });

            await OrderContent.create({
                sub_order_id: sub.id,
                product_id: cart.id,
                quantity: quantity,
                price: price
            }, { transaction });
            
            var fresh = await Order.findOne({
                where:{
                    id: order.id
                }, 
                include:{
                    SubOrder
                }
            });
            res.status(201).json({
                message: "An invoice has been sent to the buyer",
                results: fresh,
                error: false
            });
        });
    }catch(error){
        res.send(error);
    }
}