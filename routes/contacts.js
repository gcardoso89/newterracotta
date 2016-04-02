var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.redirect(301, '/contacts-and-support/how-to-buy');
});

router.get('/how-to-buy', function(req, res, next) {
	res.render('contacts-and-support/how_to_buy');
});

router.get('/delivery-and-returns', function(req, res, next) {
	res.render('contacts-and-support/delivery_and_returns');
});

module.exports = router;
