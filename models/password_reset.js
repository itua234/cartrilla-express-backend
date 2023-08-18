module.exports = (sequelize, DataTypes) => {
    const PasswordReset = sequelize.define('PasswordReset', {
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            primaryKey: true
        },
        token: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        expiry_time: {
            type: DataTypes.DATE,
        },
    },{
        timestamps: false,
        tableName: 'password_resets'
    })

    return PasswordReset;
}