var createError = require('http-errors');
var express = require('express');
var path = require('path');
var router = express.Router();

var app = express();

// Setting static media directory and including service worker option
const options = {
  setHeaders: (res, path, stat) => {
    res.set('Service-Worker-Allowed', '/');
  },
};

// Include the build folder when in production
if (process.env.NODE_ENV === 'production') {

  app.use(express.static(path.join(__dirname, 'client/build'), options));
  router.use((req, res) => {
    res.sendFile(path.join(__dirname, './client/build/index.html'));
  });

}
else {
  router.get('/', (req, res) => {
    res.send("You are in development mode. Move to client/ folder to start React Server");
  })
}

app.use('/', router);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  console.log(err.message);
  // render the error page
  res.status(err.status || 500).send(err);
});

const port = process.env.port || 8000;

app.listen(port);

module.exports = app;
