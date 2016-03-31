var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.redirect(301, '/atelier/historic-restorations');
});

router.get('/portuguese-tiles', function(req, res, next) {
	res.render('atelier/portuguese_tiles', { portugueseTiles : true });
});

router.get('/historic-restorations', function(req, res, next) {
	res.render('atelier/historic_restorations', { historicRestorations : true });
});

router.get('/bespoke-projects', function(req, res, next) {
	res.render('atelier/bespoke_projects', { bespokeProjects : true });
});

router.get('/pottery', function(req, res, next) {
	res.render('atelier/pottery', { pottery : true });
});

module.exports = router;
