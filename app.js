var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require('cors')
//require mongoose
const mongoose = require("mongoose");
// require('./controllers/UserModel');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var productsRouter = require('./routes/products');
var categoriesRouter = require('./routes/categories');
var cartsRouter = require('./routes/carts');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors()); //cho phép gọi api từ các domain khác nhau

//kết nối database mongo
mongoose.connect("mongodb://localhost:27017/Planta")//Planta là tên của database trong mongo
  .then(() => console.log("Connected to MongoDB..."))
  .catch(() => console.log("Could not connect to MongoDB..."));


//http://localhost:7777/

//http://localhost:7777/
app.use('/', indexRouter);
//http://localhost:7777/users
app.use('/users', usersRouter);
//http://localhost:7777/products
app.use('/products', productsRouter);
//http://localhost:7777/categories
app.use('/categories', categoriesRouter);
//http://localhost:7777/carts
app.use('/carts', cartsRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
