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
        tableName: 'order_contents'
    })

    OrderContent.associate = (models) => {
        OrderContent.belongsTo(models.Product, {
            onDelete: "CASCADE",
            foreignKey: 'product_id',
            targetKey: 'uuid'
        });
        OrderContent.belongsTo(models.Order, {
            onDelete: "CASCADE",
            foreignKey: 'order_id',
            targetKey: 'id'
        });
    }
    return OrderContent;
}