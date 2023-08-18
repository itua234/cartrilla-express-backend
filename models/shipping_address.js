module.exports = (sequelize, DataTypes) => {
    const ShippingAddress = sequelize.define('ShippingAddress', {
        id: {
            type: DataTypes.BIGINT(20).UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
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
        firstname: {
            type: DataTypes.STRING,
            allowNull: false,
            get() {
                const rawValue = this.getDataValue('firstname');
                return rawValue ? rawValue : null;
            },
            set(value) {
                value = value.toLowerCase();
                const val = value.charAt(0).toUpperCase() + value.slice(1);
                this.setDataValue('firstname', val);
            }
        },
        lastname: {
            type: DataTypes.STRING,
            allowNull: false,
            get() {
                const rawValue = this.getDataValue('lastname');
                return rawValue ? rawValue : null;
            },
            set(value) {
                value = value.toLowerCase();
                const val = value.charAt(0).toUpperCase() + value.slice(1);
                this.setDataValue('lastname', val);
            }
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            get() {
                const rawValue = this.getDataValue('email');
                return rawValue ? rawValue : null;
            },
            set(value) {
                this.setDataValue('email', value.toLowerCase());
            }
        },
        phone: {
            type: DataTypes.STRING,
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
        tableName: 'shipping_address'
    })
    
    return ShippingAddress;
}