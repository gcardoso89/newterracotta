var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.redirect(301, '/the-atelier/bespoke-collections');
});

router.get('/portuguese-tiles', function(req, res, next) {
	res.render('atelier/portuguese_tiles', { portugueseTiles : true });
});

router.get('/bespoke-collections', function(req, res, next) {
	res.render('atelier/bespoke_collections');
});

router.get('/bespoke-projects', function(req, res, next) {
	res.render('atelier/bespoke_projects', { bespokeProjects : true });
});

router.get('/pottery', function(req, res, next) {
	res.render('atelier/pottery', { pottery : true });
});

module.exports = router;
