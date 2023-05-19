module.exports = (sequelize, DataTypes) => {
    const Coupon = sequelize.define('Coupon', {
        id: {
            type: DataTypes.BIGINT(20).UNSIGNED,
            autoIncrement: true,
            primaryKey: true
        },
        code: {
            type: DataTypes.STRING,
            unique: true
        },
        type: {
            type: DataTypes.STRING,
        },
        value: {
            type: DataTypes.INTEGER,
        },
        percent_off: {
            type: DataTypes.INTEGER,
        },
    },{})

    return Coupon;
}