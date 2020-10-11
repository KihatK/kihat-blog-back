import {
  DataTypes, Model, HasManyAddAssociationMixin
} from 'sequelize';
import { sequelize } from './sequelize';
import { dbType } from './index';

import Scategory from './scategory';

class Bcategory extends Model {
  public id!: number;
  public name!: string;
  public order!: number;

  public addScategory!: HasManyAddAssociationMixin<Scategory, number>;

  public readonly Scategories?: Scategory[];
};

Bcategory.init({
  name: {
    type: DataTypes.STRING(30),
    allowNull: false,
  },
  order: {
    type: DataTypes.INTEGER,
    allowNull: false,
  }
}, {
  sequelize,
  modelName: 'Bcategory',
  tableName: 'bcategory',
  charset: 'utf8',
  collate: 'utf8_general_ci',
});

export const associate = (db: dbType) => {
  db.Bcategory.hasMany(db.Scategory);
};

export default Bcategory;