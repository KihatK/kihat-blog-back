import express from 'express';

import Post from '../models/post';
import Comment from '../models/comment';
import User from '../models/user';

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const posts = await Post.findAll({
      include: [{
        model: User,
        attributes: ['nickname'],
      }, {
        model: Comment,
        include: [{
          model: User,
          attributes: ['nickname'],
        }],
      }],
      limit: 2,
      order: [['createdAt', 'DESC']],
    });
    return res.json(posts);
  } catch (e) {
    console.error(e);
    return next(e);
  }
});

router.get('/all', async (req, res, next) => {
  try {
    const posts = await Post.findAll({
      include: [{
        model: User,
        attributes: ['nickname'],
      }, {
        model: Comment,
        include: [{
          model: User,
          attributes: ['nickname'],
        }],
      }],
      order: [['createdAt', 'DESC']],
    });
    return res.json(posts);
  } catch (e) {
    console.error(e);
    return next(e);
  }
});

router.get('/:scategory', async (req, res, next) => {
  try {
    const posts = await Post.findAll({
      where: { scategory: decodeURIComponent(req.params.scategory) },
      attributes: ['uuid', 'title', 'scategory', 'view', 'createdAt', 'id'],
      order: [['createdAt', 'DESC']],
    });
    return res.json(posts);
  } catch (e) {
    console.error(e);
    return next(e);
  }
});

export default router;
