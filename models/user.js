const bcrypt = require('bcrypt');
const Sequelize = require('sequelize');
const dbConfig = require('../config/db-config');
const sequelize = new Sequelize(
    dbConfig.DATABASE, 
    dbConfig.USER, 
    dbConfig.PASSWORD, 
    {
        dialect: dbConfig.DIALECT,
        host: dbConfig.HOST
    }
);

module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
        id: {
            type: DataTypes.BIGINT(20).UNSIGNED,
            autoIncrement: true,
            primaryKey: true
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
            unique: true,
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
            unique: true,
            allowNull: false
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        email_verified_at: {
            type: DataTypes.DATE,
        },
    },{
        hooks: {
            beforeCreate: async (user) => {
                if(user.password){
                    const salt = await bcrypt.genSalt(10);
                    user.password = await bcrypt.hash(user.password, salt);
                };
            },
            beforeUpdate: async (user) => {
                if(user.password){
                    const salt = await bcrypt.genSalt(10);
                    user.password = await bcrypt.hash(user.password, salt);
                };
            }
        }
    })

    return User;
}