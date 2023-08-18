const { auth } = require("../middleware/auth") ;
const { 
    sequelize,
    models: { User, ShippingAddress, BillingAddress, State, UserCard } 
} = require('../models');
const http = require('https');
require('dotenv').config();

exports.getUser = async(req, res) => {
    var user = auth(req);
    user = await User.findOne({
        where: {
            id: user.id
        },
        raw: true
    })
    let email = user.email;
    let position = email.indexOf("@");
    user.displayname = email.slice(0,position);
    res.json(user);
}

exports.getStates = async(req, res) => {
    const states = await State.findAll({});
    return res.status(200).json({
        message: "States:",
        results: states,
        error: false
    });
}

exports.getShippingAddress = async(req, res) => {
    const user = auth(req);
    let address = await ShippingAddress.findOne({
        where: {
            user_id: user.id,
        }
    });
    return res.status(200).json({
        message: "Address:",
        results: address,
        error: false
    });
}

exports.updateShippingAddress = async(req, res) => {
    const {firstname, lastname, email, phone, street, city, state} = req.body;
    const user = auth(req);
    let address = await ShippingAddress.findOne({
        where: {
            user_id: user.id,
        }
    });

    address.set({
        firstname,
        lastname,
        email,
        phone,
        street,
        city,
        state
    });
    await address.save();

    return res.status(200).json({
        message: "Address:",
        results: address,
        error: false
    });
}

exports.getBillingAddress = async(req, res) => {
    const user = auth(req);
    let address = await BillingAddress.findOne({
        where: {
            user_id: user.id,
        }
    });
    return res.status(200).json({
        message: "Address:",
        results: address,
        error: false
    });
}

exports.updateBillingAddress = async(req, res) => {
    const {firstname, lastname, email, phone, street, city, state} = req.body;
    const user = auth(req);
    let address = await BillingAddress.findOne({
        where: {
            user_id: user.id,
        }
    });

    address.set({
        firstname,
        lastname,
        email,
        phone,
        street,
        city,
        state
    });
    await address.save();

    return res.status(200).json({
        message: "Address:",
        results: address,
        error: false
    });
}

exports.updateUserDetails = async(req, res) => {
    const { firstname, lastname, phone} = req.body;
    const user = auth(req);
    await User.update({firstname, lastname, phone},
    {
        where: {
            id: user.id
        }
    });
    return res.status(200).json({
        message: "Account has been updated successfully",
        results: user,
        error: false
    });
}

exports.getUserCards = async(req, res) => {
    const user = auth(req);
    var cards = await UserCard.findAll({
        where: {
            user_id: user.id
        }
    });

    res.status(200).json({
        message: 'Card Details:',
        results: cards,
        error: false
    });
}