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

    Order.associate = (models) => {
        Order.belongsTo(models.User, {
            onDelete: "CASCADE",
            foreignKey: 'user_id',
            targetKey: 'id'
        });
        Order.hasOne(models.Address, {
            onDelete: "CASCADE",
            foreignKey: 'order_id',
            targetKey: 'id'
        });
    }
    return Order;
}