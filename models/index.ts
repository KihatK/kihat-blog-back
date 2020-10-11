import Bcategory, { associate as associateBcategory } from './bcategory';
import Comment, { associate as associateComment } from './comment';
import Image, { associate as associateImage } from './image';
import Post, { associate as associatePost } from './post';
import Scategory, { associate as associateScategory } from './scategory';
import User, { associate as associateUser } from './user';

export * from './sequelize';

const db = {
  Bcategory,
  Comment,
  Image,
  Post,
  Scategory,
  User,
};

export type dbType = typeof db;

associateBcategory(db);
associateComment(db);
associateImage(db);
associatePost(db);
associateScategory(db);
associateUser(db);