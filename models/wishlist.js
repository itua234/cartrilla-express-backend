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
const User = require('./user')(sequelize, Sequelize.DataTypes);
module.exports = (sequelize, DataTypes) => {
    const Wishlist = sequelize.define('Wishlist', {
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
        product_id: {
            type: DataTypes.UUID,
            foreignKey: true,
            references: {
                model: {tableName: 'products'},
                key: 'uuid'
            },
            allowNull: false
        },
        name: {
            type: DataTypes.STRING,
        },
        brand: {
            type: DataTypes.STRING,
        },
        price: {
            type: DataTypes.INTEGER,
        },
        image: {
            type: DataTypes.JSON,
            allowNull: false
        },
    },{})

    Wishlist.belongsTo(User, {
        onDelete: "CASCADE",
        foreignKey: 'user_id',
        targetKey: 'id'
    });
    Wishlist.belongsTo(Product, {
        onDelete: "CASCADE",
        foreignKey: 'product_id',
        targetKey: 'uuid'
    });
    return Wishlist;
}