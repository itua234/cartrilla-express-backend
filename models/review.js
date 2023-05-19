module.exports = (sequelize, DataTypes) => {
    const Review = sequelize.define('Review', {
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
        text: {
            type: DataTypes.TEXT,
        },
        rating: {
            type: DataTypes.STRING,
        },
    },{})

    Review.associate = (models) => {
        Review.belongsTo(models.User, {
            onDelete: "CASCADE",
            foreignKey: 'user_id',
            targetKey: 'id'
        });
        Review.belongsTo(models.Product, {
            onDelete: "CASCADE",
            foreignKey: 'product_id',
            targetKey: 'uuid'
        });
    }
    return Review;
}