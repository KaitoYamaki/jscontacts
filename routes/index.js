const express = require('express');
const router = express.Router();
const models = require('../models');

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
  res.render('contact_form', { title: 'コンタクトフォーム'});
});

router.post('/contacts', async function(req, res, next) {
  const num = (new Date()).getTime();
  const contact = models.Contact.create({ name: req.body.name, email: req.body.email}); // --- [4]
  // await contact.save();
  res.redirect('/');
});

module.exports = router;