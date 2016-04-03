var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
	res.render('mother-studio/mother_studio', {motherStudio : true});
});

module.exports = router;
