const express = require('express');
const router = express.Router();
const models = require('../models');
const { ValidationError } = require('sequelize'); 

/* GET home page. */
router.get('/', async function(req, res, next) {
  req.session.view_counter = (req.session.view_counter || 0) + 1; //--- [1]
  const flashMessage = req.session.flashMessage; //--- [2]
  delete req.session.flashMessage; //--- [3]
  const now = new Date();
  const contacts = await models.Contact.findAll({include: 'category'});
  console.log(contacts);
  const categories = await models.Category.findAll();
  res.render('index', { title: '連絡帳', now, contacts, categories, view_counter: req.session.view_counter, flashMessage }); //--- [4]
});

router.get('/categories/new', async function(req, res, next) {
  res.render('category_form', { title: 'カテゴリーの作成', category: {}})
})

router.get('/categories/:id', async function(req, res, next) {
  const category = await models.Category.findByPk(req.params.id);
  const contacts = await category.getContacts({ include: 'category' });
  res.render('category', { title: `カテゴリ ${category.name}`, category, contacts });
});

router.post('/categories', async function(req, res, next) {
  const fields = ['name'];
  try {
    if(req.body.id) {
      const category = await models.Category.findByPk(req.body.id); //---[1]
      category.set(req.body);
      await category.save({fields});
      req.session.flashMessage = `「${category.name}」を更新しました`; //--- [4]
    } else {
      const category = models.Category.build({ name: req.body.name });
      await category.save({fields});
      req.session.flashMessage = `新しいカテゴリーとして「${category.name}」を保存しました`;
    }
    res.redirect('/');
  } catch (err) {
    if(err instanceof ValidationError) {
      const title = (req.body.id) ? 'カテゴリーの更新' : 'カテゴリーの作成'; //--- [5〜]
      res.render(`catogory_form`, { title, category: req.body, err: err }); //--- [〜5]
    } else {
      throw err;
    }
  }
});

router.get('/about', function(req, res, next) {
  res.render('about', {title: 'About'});
});

router.get('/contact_form', async function(req, res, next) {
  const categories = await models.Category.findAll();
  res.render('contact_form', { title: 'コンタクトフォーム', contact: {}, categories });
});

router.post('/contacts', async function(req, res, next) {
  const fields = ['name', 'email', 'categoryId'];
  try {
    console.log('posted', req.body);
    if(req.body.id) {
      const contact = await models.Contact.findByPk(req.body.id); //---[1]
      contact.set(req.body);
      await contact.save({fields});
      req.session.flashMessage = `「${contact.name}」さんを更新しました`; //--- [4]
    } else {
      const contact = models.Contact.build({ name: req.body.name, email: req.body.email });
      await contact.save({fields});
      req.session.flashMessage = `新しい連絡先として「${contact.name}」さんを保存しました`;
    }
    res.redirect('/');
  } catch (err) {
    if(err instanceof ValidationError) {
      const title = (req.body.id) ? '連絡先の更新' : '連絡先の作成'; //--- [5〜]
      res.render(`contact_form`, { title, contact: req.body, err: err }); //--- [〜5]
    } else {
      throw err;
    }
  }
});

router.get('/contacts/:id/edit', async function(req, res, next) {
  const contact = await models.Contact.findByPk(req.params.id);
  res.render('contact_form', {title: '連絡先の更新', contact});
});

router.get('/categories/:id/edit', async function(req, res, next) {
  const category = await models.Category.findByPk(req.params.id);
  res.render('category_form', {title: 'カテゴリーの更新', category});
});

router.post('/contacts/:id/delete', async function(req, res, next){
  const contact = await models.Contact.findByPk(req.params.id)
  await contact.destroy();
  req.session.flashMessage = `「${contact.name}」さんを削除しました`;
  res.redirect('/');
})

router.post('/categories/:id/delete', async function(req, res, next){
  const category = await models.Category.findByPk(req.params.id)
  await category.destroy();
  req.session.flashMessage = `「${category.name}」を削除しました`;
  res.redirect('/');
})

module.exports = router;