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

const db = {};
db.sequelize = sequelize;
db.models = {};
db.models.User = require('./user')(sequelize, Sequelize.DataTypes);
db.models.State = require('./state')(sequelize, Sequelize.DataTypes);
db.models.Otp = require('./otp')(sequelize, Sequelize.DataTypes);
db.models.UserCard = require('./user_card')(sequelize, Sequelize.DataTypes);
db.models.Category = require('./category')(sequelize, Sequelize.DataTypes);
db.models.Product = require('./product')(sequelize, Sequelize.DataTypes);
db.models.Order = require('./order')(sequelize, Sequelize.DataTypes);
db.models.OrderDetail = require('./order_detail')(sequelize, Sequelize.DataTypes);
db.models.OrderContent = require('./order_content')(sequelize, Sequelize.DataTypes);
db.models.Coupon = require('./coupon')(sequelize, Sequelize.DataTypes);
db.models.ProductImage = require('./product_image')(sequelize, Sequelize.DataTypes);
db.models.Review = require('./review')(sequelize, Sequelize.DataTypes);
db.models.Address = require('./address')(sequelize, Sequelize.DataTypes);
db.models.BillingAddress = require('./billing_address')(sequelize, Sequelize.DataTypes);
db.models.ShippingAddress = require('./shipping_address')(sequelize, Sequelize.DataTypes);

module.exports = db;
