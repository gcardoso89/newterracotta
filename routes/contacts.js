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

router.get('/technical-support', function(req, res, next) {
	res.render('contacts-and-support/technical_support');
});

router.get('/contact-us', function(req, res, next) {
	res.render('contacts-and-support/contact_us');
});

router.get('/showrooms-and-retailers', function(req, res, next) {
	res.render('contacts-and-support/showrooms_and_retailers');
});

router.get('/faqs', function(req, res, next) {
	res.render('contacts-and-support/faqs');
});


router.post('/submitForm', function(req, res, next) {
	res.redirect(301, '/contacts-and-support/contact-us');
});

module.exports = router;
