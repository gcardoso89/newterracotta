var express = require('express' ),
	path = require('path'),
	favicon = require('serve-favicon' ),
	logger = require('morgan'),
	cookieParser = require('cookie-parser' ),
	bodyParser = require('body-parser'),
	hbs = require('express-hbs' ),
	routes = require('./routes/index'),
	tiles = require('./routes/tiles' ),
	atelier = require('./routes/atelier'),
	theFactory = require('./routes/the_factory' ),
	contacts = require('./routes/contacts'),
	projects = require('./routes/projects' ),
	motherStudio = require('./routes/mother_studio' ),
	colours = require('./routes/colours' ),
	gruntTasks = require('./gruntTasks' ),
	app = express();

// view engine setup

app.engine('hbs', hbs.express4({
	partialsDir: path.join(__dirname, '/views/partials'),
	layoutsDir : path.join(__dirname, '/views'),
	defaultLayout : path.join(__dirname, '/views/layout')
}));

app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, '/views'));
// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/tiles', tiles);
app.use('/the-atelier', atelier);
app.use('/the-factory', theFactory);
app.use('/projects', projects);
app.use('/contacts-and-support', contacts);
app.use('/mother-studio', motherStudio);
app.use('/colours', colours);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
