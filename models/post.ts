import {
  DataTypes, Model, Sequelize,
  BelongsToManyAddAssociationMixin, BelongsToManyRemoveAssociationMixin, HasManyAddAssociationMixin,
} from 'sequelize';
import { sequelize } from './sequelize';
import { dbType } from './index';

import User from './user';
import Comment from './comment';
import Scategory from './scategory';

class Post extends Model {
  public id!: number;
  public uuid!: string;
  public title!: string;
  public content!: string;
  public scategory!: string;
  public view!: number;
  public language!: string;
  public UserId!: number;
  public PostId!: number;
  public ScategoryId!: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public addBookMarker!: BelongsToManyAddAssociationMixin<User, number>;
  public removeBookMarker!: BelongsToManyRemoveAssociationMixin<User, number>;
  public addComment!: HasManyAddAssociationMixin<Comment, number>;

  public readonly User?: User;
  public readonly Comments?: Comment[];
  public readonly Scategory?: Scategory;
}

Post.init({
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
    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
    allowNull: false,
  },
  updatedAt: {
    type: 'TIMESTAMP',
    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
    allowNull: false,
  },
  language: {
    type: DataTypes.STRING(30),
    defaultValue: 'none',
    allowNull: false,
  },
}, {
  sequelize,
  modelName: 'Post',
  tableName: 'post',
  charset: 'utf8mb4',
  collate: 'utf8mb4_general_ci',
});

export const associate = (db: dbType) => {
  db.Post.belongsTo(db.User);
  db.Post.belongsTo(db.Scategory);
  db.Post.hasMany(db.Comment);
  db.Post.belongsToMany(db.User, { through: 'PostUser', as: 'BookMarker' });
};

export default Post;