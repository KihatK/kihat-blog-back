const DataTypes = require('sequelize');
const { Model } = DataTypes;

module.exports = class Scategory extends Model {
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
            modelName: 'Scategory',
            tableName: 'scategory',
            charset: 'utf8',
            collate: 'utf8_general_ci',
            sequelize,
        });
    }

    static associate(db) {
        db.Scategory.belongsTo(db.Bcategory);
        db.Scategory.hasMany(db.Post, { as: 'Posts' });
    }
};