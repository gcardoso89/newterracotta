var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
	res.redirect(301, '/colours/colour-palettes');
});

router.get('/colour-palettes', function(req, res, next) {
	res.render('colours/colour-palettes', { colours : true });
});

router.get('/colour-moods', function(req, res, next) {
	res.render('colours/colour-moods');
});

module.exports = router;
