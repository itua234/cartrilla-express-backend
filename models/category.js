module.exports = (sequelize, DataTypes) => {
    const Category = sequelize.define('Category', {
        id: {
            type: DataTypes.BIGINT(20).UNSIGNED,
            autoIncrement: true,
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false
        },
        slug: {
            type: DataTypes.STRING,
            //unique: true,
            //allowNull: false
        },
        image: {
            type: DataTypes.STRING,
        },
        description: {
            type: DataTypes.STRING,
        },
    },{
        timestamps: false,
    })

    Category.associate = (models) => {
        Category.hasMany(models.Product, {
            onDelete: "CASCADE",
            foreignKey: 'category_id',
            targetKey: 'id'
        });
    }
    return Category;
}