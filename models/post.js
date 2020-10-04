const DataTypes = require('sequelize');
const { Model } = DataTypes;

module.exports = class Post extends Model {
    static init(sequelize) {
        return super.init({
            uuid: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                allowNull: false,
            },
            title: {
                type: DataTypes.TEXT,
                allowNull: false,
            },
            content: {
                type: DataTypes.TEXT,
                allowNull: false,
            },
            scategory: {
                type: DataTypes.STRING(30),
                allowNull: false,
            },
            view: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 0,
            },
            createdAt: {
                type: 'TIMESTAMP',
                defaultValue: DataTypes.literal('CURRENT_TIMESTAMP'),
                allowNull: false,
            },
            updatedAt: {
                type: 'TIMESTAMP',
                defaultValue: DataTypes.literal('CURRENT_TIMESTAMP'),
                allowNull: false,
            },
            language: {
                type: DataTypes.STRING(30),
                defaultValue: 'javascript',
                allowNull: false,
            },
        }, {
            modelName: 'Post',
            tableName: 'post',
            charset: 'utf8mb4',
            collate: 'utf8mb4_general_ci',
            sequelize,
        });
    }

    static associate(db) {
        db.Post.belongsTo(db.User);
        db.Post.belongsTo(db.Scategory);
        db.Post.hasMany(db.Comment);
        db.Post.belongsToMany(db.User, { through: 'PostUser', as: 'BookMarker' });
    }
};