import {
  DataTypes, Model
} from 'sequelize';
import { sequelize } from './sequelize';
import { dbType } from './index';

import Post from './post';

class User extends Model {
  public id!: number;
  public nickname!: string;
  public userId!: string;
  public password!: string;
  public admin!: boolean;

  public BookMarked?: Post[];
};

User.init({
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
  sequelize,
  modelName: 'User',
  tableName: 'user',
  charset: 'utf8',
  collate: 'utf8_general_ci',
});

export const associate = (db: dbType) => {
  db.User.hasMany(db.Post);
  db.User.hasMany(db.Comment);
  db.User.belongsToMany(db.Post, { through: 'PostUser', as: 'BookMarked' });
};

export default User;