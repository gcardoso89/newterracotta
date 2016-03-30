var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
	res.render('the-factory/the_factory');
});

module.exports = router;
