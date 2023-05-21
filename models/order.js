const Sequelize = require('sequelize');
const dbConfig = require('../config/db-config');
const sequelize = new Sequelize(
    dbConfig.DATABASE, 
    dbConfig.USER, 
    dbConfig.PASSWORD, 
    {
        dialect: dbConfig.DIALECT,
        host: dbConfig.HOST
    }
);
const User = require('./user')(sequelize, Sequelize.DataTypes);
const Address = require('./address')(sequelize, Sequelize.DataTypes);
module.exports = (sequelize, DataTypes) => {
    const Order = sequelize.define('Order', {
        id: {
            type: DataTypes.BIGINT(20).UNSIGNED,
            autoIncrement: true,
            primaryKey: true
        },
        user_id: {
            type: DataTypes.BIGINT(20).UNSIGNED,
            foreignKey: true,
            references: {
                model: {tableName: 'users'},
                key: 'id'
            },
            allowNull: false
        },
        order_no: {
            type: DataTypes.STRING,
            unique: true
        },
        total: {
            type: DataTypes.INTEGER,
        },
        amount_paid: {
            type: DataTypes.INTEGER,
        },
        subcharge: {
            type: DataTypes.INTEGER,
        },
        shipping_cost: {
            type: DataTypes.INTEGER,
        },
        subtotal: {
            type: DataTypes.INTEGER,
        },
        reference: {
            type: DataTypes.STRING,
            unique: true
        },
        payment_status: {
            type: DataTypes.ENUM('pending', 'success', 'failed'),
            defaultValue: 'pending'
        },
        status: {
            type: DataTypes.ENUM('pending', 'delivered', 'cancelled'),
            defaultValue: 'pending'
        },
        payment_channel: {
            type: DataTypes.ENUM('FLUTTERWAVE', 'PAYSTACK')
        },
        verified: {
            type: DataTypes.BOOLEAN,
            defaultValue: 0
        },
        coupon_code: {
            type: DataTypes.STRING,
        },
    },{})

    Order.belongsTo(User, {
        onDelete: "CASCADE",
        foreignKey: 'user_id',
        targetKey: 'id'
    });
    Order.hasOne(Address, {
        onDelete: "CASCADE",
        foreignKey: 'order_id',
        targetKey: 'id',
        as: "address"
    });
    return Order;
}