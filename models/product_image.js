module.exports = (sequelize, DataTypes) => {
    const ProductImage = sequelize.define('ProductImage', {
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
        url: {
            type: DataTypes.STRING,
        },
    },{
        tableName: 'product_images'
    })

    return ProductImage;
}