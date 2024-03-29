import {
  DataTypes, Model
} from 'sequelize';
import { sequelize } from './sequelize';
import { dbType } from './index';

class Image extends Model {
  public id!: number;
  public src!: string;
  public PostId!: number;
};

Image.init({
  src: {
    type: DataTypes.STRING(200),
    allowNull: false,
  },
}, {
  sequelize,
  modelName: 'Image',
  tableName: 'image',
  charset: 'utf8',
  collate: 'utf8_general_ci',
});

export const associate = (db: dbType) => {
  db.Image.belongsTo(db.Post);
};

export default Image;