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
const ProductImage  = require('./product_image')(sequelize, Sequelize.DataTypes);
const Category = require('./category')(sequelize, Sequelize.DataTypes);
const Review = require('./review')(sequelize, Sequelize.DataTypes);
//const OrderContent = require('./order_content')(sequelize, Sequelize.DataTypes);

module.exports = (sequelize, DataTypes) => {
    const Product = sequelize.define('Product', {
        uuid: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        category_id: {
            type: DataTypes.BIGINT(20).UNSIGNED,
            foreignKey: true,
            references: {
                model: {tableName: 'categories'},
                key: 'id'
            },
            allowNull: false
        },
        name: {
            type: DataTypes.STRING,
        },
        brand: {
            type: DataTypes.STRING,
        },
        stock: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        price: {
            type: DataTypes.INTEGER,
        },
        description: {
            type: DataTypes.STRING,
        },
        sales: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        shipping_cost: {
            type: DataTypes.INTEGER,
        },
    })

    Product.hasMany(ProductImage, {
        onDelete: "CASCADE",
        foreignKey: 'product_id',
        targetKey: 'uuid',
        as: "images"
    });
    Product.belongsTo(Category, {
        onDelete: "CASCADE",
        foreignKey: 'category_id',
        targetKey: 'id',
        as: "category"
    });
    Product.hasMany(Review, {
        onDelete: "CASCADE",
        foreignKey: 'product_id',
        targetKey: 'uuid'
    });
    /*Product.hasMany(OrderContent, {
        onDelete: "CASCADE",
        foreignKey: 'product_id',
        targetKey: 'uuid',
        as: "orders"
    });*/
    return Product;
}