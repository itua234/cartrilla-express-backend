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
const Product  = require('./product')(sequelize, Sequelize.DataTypes);
module.exports = (sequelize, DataTypes) => {
    const OrderContent = sequelize.define('OrderContent', {
        id: {
            type: DataTypes.BIGINT(20).UNSIGNED,
            autoIncrement: true,
            primaryKey: true
        },
        product_id: {
            type: DataTypes.UUID,
            foreignKey: true,
            references: {
                model: {tableName: 'products'},
                key: 'uuid'
            },
            allowNull: false
        },
        order_id: {
            type: DataTypes.BIGINT(20).UNSIGNED,
            foreignKey: true,
            references: {
                model: {tableName: 'orders'},
                key: 'id'
            },
            allowNull: false
        },
        price: {
            type: DataTypes.STRING,
        },
        quantity: {
            type: DataTypes.INTEGER,
        },
        payment: {
            type: DataTypes.ENUM('pending', 'received'),
            defaultValue: 'pending'
        },
        status: {
            type: DataTypes.ENUM('pending', 'shipped', 'delivered', 'confirmed', 'cancelled'),
            defaultValue: 'pending'
        },
    },{
        timestamps: false,
        tableName: 'order_contents'
    })

    OrderContent.belongsTo(Product, {
        foreignKey: 'product_id',
        targetKey: 'uuid',
        as: "product"
    });

    return OrderContent;
}