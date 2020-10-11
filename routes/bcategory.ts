import express from 'express';

import Bcategory from '../models/bcategory';
import Scategory from '../models/scategory';
import Post from '../models/post';
import { isAdminLoggedIn } from './middlewares';

const router = express.Router();

router.post('/', isAdminLoggedIn, async (req, res, next) => {
  try {
    const newBcategory = await Bcategory.create({
      name: req.body.bcategoryData,
      order: req.body.bcategoryOrder,
    });
    const sendBcategory = await Bcategory.findOne({
      where: { id: newBcategory.id },
      include: [{
        model: Scategory,
        attributes: ['name'],
      }],
      attributes: ['name'],
    });
    return res.json(sendBcategory);
  } catch (e) {
    console.error(e);
    return next(e);
  }
});

router.get('/', async (req, res, next) => {
  try {
    const category = await Bcategory.findAll({
      include: [{
        model: Scategory,
        attributes: ['name'],
      }],
      order: [['order', 'ASC']],
      attributes: ['name'],
    });
    return res.json(category);
  } catch (e) {
    console.error(e);
    return next(e);
  }
});

router.patch('/', isAdminLoggedIn, async (req, res, next) => {
  try {
    const bcategory = await Bcategory.findOne({ where: { name: req.body.bcategory } });
    const newBcategory = await Bcategory.findOne({ where: { name: req.body.newBcategory } });
    if (newBcategory) {
      return res.status(403).send('이미 존재하는 카테고리 이름입니다.');
    }
    await Bcategory.update({ name: req.body.newBcategory }, { where: { id: bcategory?.id } });
    return res.send('변경 성공!');
  } catch (e) {
    console.error(e);
    return next(e);
  }
});
router.delete('/:bcategory', isAdminLoggedIn, async (req, res, next) => {
  try {
    const bcategory = await Bcategory.findOne({ where: { name: req.params.bcategory } });
    if (!bcategory) {
      return res.status(403).send('존재하지 않는 카테고리입니다.');
    }
    const scategories = await Scategory.findAll({
      where: { BcategoryId: bcategory.id },
      order: [['createdAt', 'DESC']],
    });
    //카테고리 삭제하면 해당 카테고리 글 또한 삭제함
    await Promise.all(
      scategories.map(async (s) => {
        const posts = await Post.findAll({
          where: { ScategoryId: s.id },
          order: [['createdAt', 'DESC']],
        });
        return await Promise.all(
          posts.map((p) => {
            return Post.destroy({ where: { id: p.id } });
          }),
        );
      }),
    );
    await Promise.all(
      scategories.map((s) => {
        return Scategory.destroy({ where: { id: s.id } });
      }),
    );
    await Bcategory.destroy({ where: { id: bcategory.id } });
    return res.send('삭제 성공!');
  } catch (e) {
    console.error(e);
    return next(e);
  }
});

router.patch('/order', isAdminLoggedIn, async (req, res, next) => {
  try {
    const bcategory1 = await Bcategory.findOne({ where: { name: req.body.bcategory1 } });
    const bcategory2 = await Bcategory.findOne({ where: { name: req.body.bcategory2 } });
    if (!bcategory1 || !bcategory2) {
      return res.status(403).send('카테고리가 존재하지 않습니다.');
    }
    const order1 = bcategory1.order;
    const order2 = bcategory2.order;
    await Bcategory.update({ order: order2 }, { where: { id: bcategory1.id } });
    await Bcategory.update({ order: order1 }, { where: { id: bcategory2.id } });
    return res.send('순서 변경 성공!');
  } catch (e) {
    console.error(e);
    return next(e);
  }
});

export default router;
