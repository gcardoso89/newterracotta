var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.redirect(301, '/the-atelier/bespoke-collections');
});

router.get('/portuguese-tiles', function(req, res, next) {
	res.render('atelier/portuguese_tiles');
});

router.get('/bespoke-collections', function(req, res, next) {
	res.render('atelier/bespoke_collections');
});

router.get('/inside-the-atelier', function(req, res, next) {
	res.render('atelier/inside_atelier');
});

router.get('/artists-at-home', function(req, res, next) {
	res.render('atelier/artists_at_home');
});

module.exports = router;
