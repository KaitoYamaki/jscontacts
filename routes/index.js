const express = require('express');
const router = express.Router();
const models = require('../models');
const { ValidationError } = require('sequelize'); 

/* GET home page. */
router.get('/', async function(req, res, next) {
  const now = new Date();
  const contacts = await models.Contact.findAll();
  res.render('index', { title: '連絡帳', now: now, contacts: contacts });
});

router.get('/about', function(req, res, next) {
  res.render('about', {title: 'About'});
});

router.get('/contact_form', function(req, res, next) {
  res.render('contact_form', { title: 'コンタクトフォーム', contact: {} });
});

router.post('/contacts', async function(req, res, next) {
  try {
    if(req.body.id){
      const contact = await models.Contact.findByPk(req.body.id);
      contact.name= req.body.name;
      contact.email= req.body.email;
      await contact.save();
      req.session.flashMessage= `「${contact.name}」さんを更新しました`;
    }else{
      const contact = models.Contact.build({ name: req.body.name, email: req.body.email });
      await contact.save();
      req.session.flashMessage = `新しい連絡先として「${contact.name}」さんを保存しました`;
    }
    res.redirect('/');
  } catch (err) {
    if(err instanceof ValidationError) {
      const title = (req.body.id) ? '連絡先の更新' : '連絡先の作成'; //--- [5〜]
      res.render(`contact_form`, { title, contact: req.body, err: err }); //--- [〜5]
    } else {
      throw err; // ここでの対応を諦めて処理系に任せる
    }
  }
});

router.get('/contacts/:id/edit', async function(req, res, next) {
  const contact = await models.Contact.findByPk(req.params.id);
  res.render('contact_form', {title: '連絡先の更新', contact});
});

router.post('/contacts/:id/delete', async function(req, res, next){
  const contact = await models.Contact.findByPk(req.params.id)
  await contact.destroy();
  req.session.flashMessage = `「${contact.name}」さんを削除しました`;
  res.redirect('/');
})

module.exports = router;