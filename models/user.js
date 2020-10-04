const DataTypes = require('sequelize');
const { Model } = DataTypes;

module.exports = class User extends Model {
    static init(sequelize) {
        return super.init({
            nickname: {
                type: DataTypes.STRING(20),
                allowNull: false,
                unique: true,
            },
            userId: {
                type: DataTypes.STRING(20),
                allowNull: false,
                unique: true,
            },
            password: {
                type: DataTypes.STRING(100),
                allowNull: false,
            },
            admin: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false,
            },
        }, {
            modelName: 'User',
            tableName: 'user',
            charset: 'utf8',
            collate: 'utf8_general_ci',
            sequelize,
        });
    }

    static associate(db) {
        db.User.hasMany(db.Post);
        db.User.hasMany(db.Comment);
        db.User.belongsToMany(db.Post, { through: 'PostUser', as: 'BookMarked' });
    }
};