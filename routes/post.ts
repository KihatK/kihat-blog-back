import express, { Request } from 'express';
import path from 'path';
import multer from 'multer';
import multerS3 from 'multer-s3';
import AWS from 'aws-sdk';
import { Sequelize } from 'sequelize';

import Post from '../models/post';
import User from '../models/user';
import Scategory from '../models/scategory';
import Comment from '../models/comment';
import { isLoggedIn, isAdminLoggedIn } from './middlewares';

const router = express.Router();

interface S3 extends Request {
  file: any;
}

AWS.config.update({
  accessKeyId: process.env.S3_ACCESS_KEY_ID,
  secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
  region: 'us-east-1',
});
const upload = multer({
  storage: multerS3({
    s3: new AWS.S3(),
    bucket: 'kihat-blog',
    key(req, file, cb) {
      cb(null, `original/${Date.now()}_${path.basename(file.originalname)}`);
      //original은 폴더 이름을 만들고 그 곳에 넣는 것
    },
  }),
  limits: { fileSize: 20 * 1024 * 1024 },
});

router.post('/', isAdminLoggedIn, async (req, res, next) => {
  //게시글 작성
  try {
    const scategoryOfPost = await Scategory.findOne({
      where: { name: req.body.scategory },
    });
    const newPost = await Post.create({
      title: req.body.title,
      content: req.body.content,
      scategory: req.body.scategory,
      UserId: req.user.id,
      ScategoryId: scategoryOfPost.id,
    });
    await scategoryOfPost.addPost(newPost);
    const fullPost = await Post.findOne({
      where: { id: newPost.id },
      include: [{
        model: User,
        attributes: ['id', 'nickname'],
      }],
    });
    return res.json(fullPost);
  } catch (e) {
    console.error(e);
    return next(e);
  }
});
router.post('/image', upload.single('image'), async (req, res) => {
  return res.json((req as S3).file.location);
});

router.get('/:uuid', async (req, res, next) => {
  //게시글 1개 가져오기
  try {
    const onePost = await Post.findOne({
      where: { uuid: req.params.uuid },
      include: [{
        model: User,
        attributes: ['nickname'],
      }, {
        model: Comment,
        include: [{
          model: User,
          attributes: ['nickname'],
        }],
        attributes: ['content', 'createdAt'],
        order: [['createdAt', 'DESC']],
      }],
    });
    if (!onePost) {
      return res.status(403).send('게시글이 존재하지 않습니다.');
    }
    if (req.user && req.user.admin) {
      return res.json(onePost);
    }
    await Post.update({ view: Sequelize.literal(`view + 1`) }, { where: { id: onePost.id } });
    return res.json(onePost);
  } catch (e) {
    console.error(e);
    return next(e);
  }
});

router.post('/:id/comment', isLoggedIn, async (req, res, next) => {
  //댓글 쓰기
  try {
    const post = await Post.findOne({ where: { uuid: req.params.id } });
    if (!post) {
      return res.status(403).send('게시글이 존재하지 않습니다.');
    }
    if (!req.user) {
      return res.status(403).send('로그인한 유저만 댓글을 쓰실 수 있습니다.');
    }
    const newComment = await Comment.create({
      content: req.body.comment,
      UserId: req.user.id,
      PostId: post.id,
    });
    await post.addComment(newComment);
    const fullComment = await Comment.findOne({
      where: { id: newComment.id },
      include: [{
        model: User,
        attributes: ['nickname'],
      }],
      attributes: ['content', 'createdAt'],
    });
    return res.json(fullComment);
  } catch (e) {
    console.error(e);
    return next(e);
  }
});

router.delete('/:uuid', isAdminLoggedIn, async (req, res, next) => {
  try {
    const post = await Post.findOne({ where: { uuid: req.params.uuid } });
    if (!post) {
      return res.status(403).send('게시글이 존재하지 않습니다.');
    }
    if (post.UserId !== (req.user.id)) {
      return res.status(401).send('작성자만 삭제할 수 있습니다.');
    }
    await Post.destroy({ where: { uuid: req.params.uuid } });
    return res.json(req.params.uuid);
  } catch (e) {
    console.error(e);
    return next(e);
  }
});

router.patch('/:uuid', isAdminLoggedIn, async (req, res, next) => {
  try {
    const post = await Post.findOne({ where: { uuid: req.params.uuid } });
    if (!post) {
      return res.status(403).send('게시글이 존재하지 않습니다.');
    }
    if (post.UserId !== (req.user.id)) {
      return res.status(403).send('작성자만 수정할 수 있습니다.');
    }
    const scategoryOfPost = await Scategory.findOne({
      where: { name: req.body.scategory },
    });
    await Post.update({
      title: req.body.title,
      content: req.body.content,
      scategory: req.body.scategory,
      ScategoryId: scategoryOfPost.id,
    }, {
      where: { uuid: req.params.uuid },
    });
    return res.send('수정 완료!');
  } catch (e) {
    console.error(e);
    return next(e);
  }
});

export default router;
