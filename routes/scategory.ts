import express from 'express';

import Scategory from '../models/scategory';
import Bcategory from '../models/bcategory';
import Post from '../models/post';
import { isAdminLoggedIn } from './middlewares';

const router = express.Router();

router.post('/', isAdminLoggedIn, async (req, res, next) => {
  try {
    if (req.body.scategoryData.match(/\//g) || req.body.scategoryData.match(/\./g)) {
      return res.status(401).send('카테고리 이름에 "/" 또는 "."가 들어가서는 안됩니다.');
    }
    const newBcategory = await Bcategory.findOne({
      where: { name: req.body.bcategory },
    });
    const newScategory = await Scategory.create({
      name: req.body.scategoryData,
      order: req.body.order,
      BcategoryId: newBcategory?.id,
    });
    await newBcategory.addScategory(newScategory);
    const sendScategory = await Scategory.findOne({
      where: { id: newScategory.id },
      attributes: ['name'],
    });
    return res.json(sendScategory);
  } catch (e) {
    console.error(e);
    return next(e);
  }
});

router.get('/', async (req, res, next) => {
  //scategory들 가져오기
  try {
    const scategories = await Scategory.findAll({
      attributes: ['name'],
      order: [['createdAt', 'DESC']],
    });
    return res.json(scategories);
  } catch (e) {
    console.error(e);
    return next(e);
  }
});

router.patch('/', isAdminLoggedIn, async (req, res, next) => {
  try {
    if (req.body.newScategory.match(/\//g) || req.body.newScategory.match(/\./g)) {
      return res.status(401).send('카테고리 이름에 "/" 또는 "."가 들어가서는 안됩니다.');
    }
    const scategory = await Scategory.findOne({ where: { name: req.body.scategory } });
    const newScategory = await Scategory.findOne({ where: { name: req.body.newScategory } });
    if (newScategory) {
      return res.status(403).send('이미 존재하는 카테고리 이름입니다.');
    }
    await Scategory.update({ name: req.body.newScategory }, { where: { id: scategory?.id } });
    const posts = await Post.findAll({ where: { ScategoryId: scategory.id } });
    await Promise.allSettled(posts.map((p) => {
      Post.update({ scategory: req.body.newScategory }, { where: { id: p.id } });
    }));
    return res.send('변경 성공!');
  } catch (e) {
    console.error(e);
    return next(e);
  }
});
router.delete('/:scategory', isAdminLoggedIn, async (req, res, next) => {
  try {
    const scategory = await Scategory.findOne({ where: { name: req.params.scategory } });
    if (!scategory) {
      return res.status(403).send('존재하지 않는 카테고리입니다.');
    }
    const posts = await Post.findAll({
      where: { ScategoryId: scategory.id },
      order: [['createdAt', 'DESC']],
    });
    await Promise.allSettled(
      posts.map((p) => {
        return Post.destroy({ where: { id: p.id } });
      }),
    );
    await Scategory.destroy({ where: { id: scategory.id } });
    return res.send('삭제 성공!');
  } catch (e) {
    console.error(e);
    return next(e);
  }
});

// router.patch('/order', isAdminLoggedIn, async (req, res, next) => {
//   try {
//     const scategory1 = await Scategory.findOne({ where: { name: req.body.scategory1 } });
//     const scategory2 = await Scategory.findOne({ where: { name: req.body.scategory2 } });
//     if (!scategory1 || !scategory2) {
//       return res.status(403).send('카테고리가 존재하지 않습니다.');
//     }
//     const order1 = scategory1.order;
//     const order2 = scategory2.order;
//     await Scategory.update({ order: order2 }, { where: { id: scategory1.id } });
//     await Scategory.update({ order: order1 }, { where: { id: scategory2.id } });
//     return res.send('순서 변경 성공!');
//   }
//   catch (e) {
//     console.error(e);
//     return next(e);
//   }
// });

export default router;
