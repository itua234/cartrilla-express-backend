module.exports = (sequelize, DataTypes) => {
    const UserCard = sequelize.define('UserCard', {
        id: {
            type: DataTypes.BIGINT(20).UNSIGNED,
            autoIncrement: true,
            primaryKey: true
        },
        // uuid: {
        //     type: DataTypes.UUID,
        //     defaultValue: DataTypes.UUIDV4,
        // },
        user_id: {
            type: DataTypes.BIGINT(20).UNSIGNED,
            foreignKey: true,
            references: {
                model: {tableName: 'users'},
                key: 'id'
            },
            allowNull: false
        },
        authorization_code: {
            type: DataTypes.STRING,
        },
        card_type: {
            type: DataTypes.STRING,
        },
        last4: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        exp_month: {
            type: DataTypes.STRING,
        },
        exp_year: {
            type: DataTypes.STRING,
        },
        bin: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        bank: {
            type: DataTypes.STRING,
        },
        brand: {
            type: DataTypes.STRING,
        },
        channel: {
            type: DataTypes.STRING,
        },
        signature: {
            type: DataTypes.STRING,
        },
        reusable: {
            type: DataTypes.BOOLEAN,
            defaultValue: 1,
            allowNull: false,
        },
        country_code: {
            type: DataTypes.STRING,
        },
        account_name: {
            type: DataTypes.STRING,
        },
    },{
        tableName: 'user_cards'
    })

    return UserCard;
}