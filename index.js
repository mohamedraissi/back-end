var express = require("express");
var mongoose = require("mongoose");
var dotenv = require("dotenv");
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var nunjucks = require('nunjucks');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var passport =require('passport');
var flash = require('connect-flash');
var expressValidator = require('express-validator');
var methodOverride = require('method-override');

var dbconfig=require('./config/database');
var index = require('./routes/index');
var login = require('./routes/login');
var users = require('./routes/users');
var app = express();
dotenv.config({ path: ".env" });
app.set("port", process.env.PORT || 5000);
app.set('views', path.join(__dirname, 'views'));
mongoose.connect(process.env.DB_HOST || "mongodb://localhost:27017/voyage", function(err,database){
  if (err) {
    console.log(err);
  }
  else {
    console.log("connecté");
  }
});
app.use(logger('dev'));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '/public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
//pour methodOverrides
app.use(methodOverride(function (req, res) {
  if (req.body && typeof req.body === 'object' && '_method' in req.body) {
    var method = req.body._method
    delete req.body._method
    return method
  }
}));
//pour express-validator
app.use(expressValidator());
//Configuration du passeport
app.use(session({
  secret: 'keyboard',
  resave: false,
  saveUninitialized: false,
}));
require('./config/passport')(passport);
app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

app.get('/admin/*',function(req, res, next) {
 
  res.locals.user = req.user || null;
  res.locals.path = req.path ;
  next();
});
nunjucks.configure("views",{
	autoescape:true,
	express:app
});

app.use('/admin', index);
app.use('/', login);
app.use('/users', users);

app.get('/',(req,res) => {
  res.redirect('/login');
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});
// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error.html');
});

app.listen(app.get('port'),function(){
	console.log("Server running at http://localhost:" + app.get("port"));
}); 