var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.redirect(301, '/tiles/field-tiles');
});

router.get('/portuguese-tiles', function(req, res, next) {
	res.render('atelier/portuguese_tiles');
});

module.exports = router;
