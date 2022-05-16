var express = require('express');
const { route } = require('express/lib/application');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  const now = new Date();
  res.render('index', { title: 'Hello World', now: now });
});

router.get('/about', function(req, res, next) {
  res.render('about', {title: 'About'});
});

router.get('/contact_form', function(req, res, next) {
  res.render('contact_form', { title: 'コンタクトフォーム'});
});

router.post('/contacts', function(req, res, next) {
  console.log('posted', req.params);
  res.redirect('/');
});

module.exports = router;