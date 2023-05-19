module.exports = (sequelize, DataTypes) => {
    const UserVerification = sequelize.define('UserVerification', {
        id: {
            type: DataTypes.BIGINT(20),
            autoIncrement: true,
            primaryKey: true
        },
        code: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        email: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false
        },
        expiry_time: {
            type: DataTypes.DATE,
        },
    },{
        timestamps: false,
        tableName: 'user_verifications'
    })

    return UserVerification;
}