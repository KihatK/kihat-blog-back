import {
  DataTypes, Model,
  HasManyAddAssociationMixin
} from 'sequelize';
import { sequelize } from './sequelize';
import { dbType } from './index';

import Post from './post';

class Scategory extends Model {
  public id!: number;
  public name!: string;
  public order!: number;
  public BcategoryId!: number;

  public addPost!: HasManyAddAssociationMixin<Post, number>;

  public Posts?: Post[];
};

Scategory.init({
  name: {
    type: DataTypes.STRING(30),
    allowNull: false,
  },
  order: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
}, {
  sequelize,
  modelName: 'Scategory',
  tableName: 'scategory',
  charset: 'utf8',
  collate: 'utf8_general_ci',
});

export const associate = (db: dbType) => {
  db.Scategory.belongsTo(db.Bcategory);
  db.Scategory.hasMany(db.Post, { as: 'Posts' });
};

export default Scategory;