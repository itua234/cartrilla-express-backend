module.exports = (sequelize, DataTypes) => {
    const Account = sequelize.define('Account', {
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
        account_name: {
            type: DataTypes.TEXT,
        },
        account_number: {
            type: DataTypes.TEXT,
        },
        bank_name: {
            type: DataTypes.STRING,
        },
        bank_code: {
            type: DataTypes.STRING,
        },
    },{})

    return Account;
}