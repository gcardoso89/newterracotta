var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'New Terracotta - Portuguese Handmade' });
});

router.get('/portuguese-tiles', function(req, res, next) {
  res.render('atelier/portuguese_tiles');
});

module.exports = router;
