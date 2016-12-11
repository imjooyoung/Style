// 외부 모듈들을 사용
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var methodOverride = require('method-override');
var flash = require('connect-flash');
var mongoose   = require('mongoose');
var passport = require('passport');
var configAuth = require('./config/auth');

// 지정 모듈들을 사용 
var routes = require('./routes/index'),
    users = require('./routes/users'),
    posts = require('./routes/posts'),
    rooms = require('./routes/rooms');
//    hosting = require('./routes/hosting');

var routeAuth = require('./routes/auth');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views')); // __dirname : 현재 실행중인 코드의 폴더 경로
app.set('view engine', 'jade');
if (app.get('env') === 'development') {
  app.locals.pretty = true;
}
app.locals.moment = require('moment');

// mongodb connect
mongoose.connect('mongodb://young69825:wndud234@ds139817.mlab.com:39817/jooyoung');
mongoose.connection.on('error', console.log);

// uncomment after placing your favicon in /public
// app.use(express.static('public')); 
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(methodOverride('_method', {methods: ['POST', 'GET']}));

app.use(session({
  resave: true,
  saveUninitialized: true,
  secret: 'long-long-long-secret-string-1313513tefgwdsvbjkvasd' 
}));
app.use(flash());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/bower_components',  express.static(path.join(__dirname, '/bower_components')));


app.use(passport.initialize());
app.use(passport.session());

app.use(function(req, res, next) {
  res.locals.currentUser = req.user;
  res.locals.flashMessages = req.flash();
  next();
});

configAuth(passport);

// 라우트 합니다.
app.use('/', routes);  // 메인 홈페이지~ routes파일에 있는 index.js가 
app.use('/users', users); // localhost:3000/users는 users.js
app.use('/posts', posts); // /posts 는 posts.js
app.use('/rooms', rooms); // ..
//app.use('/hosting', hosting);
routeAuth(app, passport);

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
