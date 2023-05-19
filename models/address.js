module.exports = (sequelize, DataTypes) => {
    const Address = sequelize.define('Address', {
        id: {
            type: DataTypes.BIGINT(20).UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
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
        street: {
            type: DataTypes.STRING,
        },
        city: {
            type: DataTypes.STRING,
        },
        state: {
            type: DataTypes.STRING,
        },
    },{
        tableName: 'address'
    })
    
    Address.associate = (models) => {
        Address.belongsTo(models.Order, {
            onDelete: "CASCADE",
            foreignKey: 'order_id',
            targetKey: 'id'
        });
    }
    return Address;
}