var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.redirect(301, '/tiles/field-tiles');
});

router.get('/field-tiles', function(req, res, next) {
	res.render('tiles/field_tiles', { fieldTiles : true });
});

router.get('/mouldings', function(req, res, next) {
	res.render('tiles/mouldings', { mouldings : true });
});

router.get('/portuguese-heritage', function(req, res, next) {
	res.render('tiles/portuguese_heritage', { portugueseHeritage : true });
});

router.get('/new-modern', function(req, res, next) {
	res.render('tiles/new_modern', { newModern : true });
});

module.exports = router;
