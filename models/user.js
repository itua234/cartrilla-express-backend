const bcrypt = require('bcrypt');
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

    User.associate = (models) => {
        User.hasMany(models.Order, {
            onDelete: "CASCADE",
            foreignKey: 'user_id',
            targetKey: 'id'
        });
        User.hasMany(models.SubOrder, {
            onDelete: "CASCADE",
            foreignKey: 'user_id',
            targetKey: 'id'
        });
        User.hasMany(models.Product, {
            onDelete: "CASCADE",
            foreignKey: 'user_id',
            targetKey: 'id'
        });
        User.hasOne(models.Account, {
            onDelete: "CASCADE",
            foreignKey: 'user_id',
            targetKey: 'id'
        });
        User.hasOne(models.UserProfile, {
            onDelete: "CASCADE",
            foreignKey: 'user_id',
            targetKey: 'id'
        });
        User.hasMany(models.Wishlist, {
            onDelete: "CASCADE",
            foreignKey: 'user_id',
            targetKey: 'id'
        });
    }
    return User;
}