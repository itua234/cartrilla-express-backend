module.exports = (sequelize, DataTypes) => {
    const Otp = sequelize.define('Otp', {
        id: {
            type: DataTypes.BIGINT(20).UNSIGNED,
            autoIncrement: true,
            primaryKey: true
        },
        token: {
            type: DataTypes.STRING,
            allowNull: false
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false
        },
        valid: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
            allowNull: false
        },
        purpose: {
            type: DataTypes.ENUM(
                'email_verification', 
                'password_reset'
            ),
            defaultValue: 'email_verification'
        }
    })
    
    return Otp;
}