import {
  DataTypes, Model
} from 'sequelize';
import { sequelize } from './sequelize';
import { dbType } from './index';

import User from './user';

class Comment extends Model {
  public id!: number;
  public content!: string;
  public UserId!: number;
  public PostId!: number;

  public readonly User?: User;
};

Comment.init({
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
}, {
  sequelize,
  modelName: 'Comment',
  tableName: 'comment',
  charset: 'utf8mb4',
  collate: 'utf8mb4_general_ci',
});

export const associate = (db: dbType) => {
  db.Comment.belongsTo(db.Post);
  db.Comment.belongsTo(db.User);
};

export default Comment;