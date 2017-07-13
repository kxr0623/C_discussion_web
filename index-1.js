var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var engine=require('consolidate');

var index = require('./routes/index');
var users = require('./routes/users');
var birds = require('./routes/single');
const DbQuery = require('./dbconnector');

var app = express();


// view engine setup  加载.html文件-->HTML文件
app.set('views', path.join(__dirname, 'views'));
app.engine('html',engine.mustache);
app.set('view engine', 'html');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
//support parsing of application/json type post data
app.use(bodyParser.json());
//support parsing of application/x-www-form-urlencoded post data
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
//tell express that public is the root of our public web folder
app.use(express.static(path.join(__dirname, 'public')));

var cb0 = function (req, res, next) {
  console.log('CB0')
  next()
}

var cb1 = function (req, res, next) {
  console.log('CB1')
  next()
}

app.get('/', [cb0, cb1], function (req, res, next) {
  console.log('the response will be sent by the next function ...')
  next()
}, function (req, res) {
  //res.locals.username = req.session.username;
  res.render('1.html');
   // res.send("hello");
})


app.get('/test', function (req, res) {
    DbQuery()
        .then((text) => res.send(text))//sent the data from db to page
        .catch((err) => console.log(err))//else catch an err
})



var portnumber=3332;
app.listen(portnumber, function () {
    console.log('Example app listening on port '+portnumber)
})



//check the
app.use(function (req,res,next) {
    res.status(404).send("404!!!Sorry cannot find that page!")
})

app.use(function (err,req,res,next) {
    console.error(err.stack)
    res.status(500).send("something broken!!!")
})
