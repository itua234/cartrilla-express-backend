module.exports = (sequelize, DataTypes) => {
    const State = sequelize.define('State', {
        name: {
            type: DataTypes.STRING,
            unique: true,
            primaryKey: true,
            allowNull: false
        },
        lgas: {
            type: DataTypes.JSON,
            allowNull: false,
            get() {
                const rawValue = this.getDataValue('lgas');
                return rawValue ? rawValue : null;
            },
            set(value) {
                this.setDataValue('lgas', JSON.stringify(value));
            }
        },
    },{
        timestamps: false,
    })

    return State;
}