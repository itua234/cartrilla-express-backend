module.exports = (sequelize, DataTypes) => {
    const UserProfile = sequelize.define('UserProfile', {
        id: {
            type: DataTypes.BIGINT(20),
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
        address: {
            type: DataTypes.STRING,
        },
        state: {
            type: DataTypes.STRING,
        },
        orders: {
            type: DataTypes.INTEGER, defaultValue: 0
        },
        sales: {
            type: DataTypes.INTEGER, defaultValue: 0
        },
        rating: {
            type: DataTypes.DOUBLE, defaultValue: 0
        },
        customers: {
            type: DataTypes.STRING
        },
        reviews: {
            type: DataTypes.INTEGER, defaultValue: 0
        },
    },{
        tableName: 'user_profiles'
    })

    return UserProfile;
}