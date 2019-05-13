var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bodyParser = require('body-parser');
var session = require('express-session');
var passport = require('passport');
var fbStrategy = require('passport-facebook').Strategy;

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var config = require('./config');
var models = require('./models/index').models;


var app = express();

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

passport.use(new fbStrategy({
  clientID: config.appId,
  clientSecret: config.appSecret,
  callbackURL: config.callbackUrl,
  profileURL: config.profileURL,
  profileFields: config.profileFields,
}, (token, refreshToken, profile, done) => {
  console.log(profile);
  user = models.User.findOne({fb_id: profile.id}).exec((err, user) => {
    if (err) {
      console.log("Error searching for user");
      return done(err);
    }
    
    if (!user) {
      console.log("User not found");
      var newUser = models.User({
        name: profile.name.givenName + " " + profile.name.familyName,
        fb_id: profile.id,
        token: token,
        profile: profile.profileUrl,
      });
      newUser.save((err) => {
        if (err) {
          console.log("Error creating new user");
          return done(err);
        }
        console.log("Successfully created new user");
        return done(null, newUser);
      });
    }
    else {
      console.log("User found. Returning the user");
      return done(null, user);
    }
  });
}));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session({secret: 'app-secret', resave: true, saveUninitialized: true}));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));

function isLoggedIn(req, res, next) {
  if  (req.isAuthenticated())
    return next();
  res.sendStatus(403);
}

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
