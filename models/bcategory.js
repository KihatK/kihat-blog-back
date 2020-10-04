const DataTypes = require('sequelize');
const { Model } = DataTypes;

module.exports = class Bcategory extends Model {
    static init(sequelize) {
        return super.init({
            name: {
                type: DataTypes.STRING(30),
                allowNull: false,
            },
            order: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
        }, {
            modelName: 'Bcategory',
            tableName: 'bcategory',
            charset: 'utf8',
            collate: 'utf8_general_ci',
            sequelize,
        });
    }

    static associate(db) {
        db.Bcategory.hasMany(db.Scategory);
    }
};