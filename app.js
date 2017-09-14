var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var engine = require('consolidate');
var validUrl = require('valid-url');
var url = require('url');
var session = require('express-session');
var hbs = require('express-handlebars').create({
    extname: '.hbs'
});

var index = require('./routes/index');
var contact = require('./routes/contact');
var reply = require('./routes/reply');
var single = require('./routes/single');
var routes_signopt = require('./routes/login.js');
var logout = require('./routes/logout.js');
var signup = require('./routes/signup.js');
var newtopic = require('./routes/newtopic_r.js');
var articles = require('./routes/articles');
var newarticles = require('./routes/newArticle');
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
//support parsing of application/json type post data
app.use(bodyParser.json());
//support parsing of application/x-www-form-urlencoded post data
app.use(bodyParser.urlencoded({extended: false}));

app.use(cookieParser());
//tell express that public is the root of our public web folder
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({secret: 'ssshhh', saveUninitialized: true, resave: true}));

app.use('/', index);
app.use('/single', single);
app.use('/contact', contact);
app.use('/reply', reply);
app.use('/login', routes_signopt);
app.use('/logout', logout);
app.use('/reg', signup);
app.use('/reply', reply);
app.use('/topic', newtopic);
app.use('/articles-list', articles);
app.use('/new_article', newarticles);

app.use(function (req, res, next) {
    getFullUrl(req, function (fullUrl) {
        console.log("fullURL->", fullUrl);
        if (validUrl.isUri(fullUrl)) {
            next();
        }
        else {
            console.log('Not a URI->', fullUrl);
            res.render('error', {"message": "Don't be naughty. This is not a validated URL."});
        }

    });
});
function getFullUrl(req, callback) {
    callback(url.format({
        protocol: req.protocol,
        host: req.get('host'),
        pathname: req.originalUrl
    }));
}

app.use(function (req, res, next) {
    res.locals.user = req.session.user;   // read user from session
    var err = req.session.error;   //
    delete req.session.error;
    res.locals.message = "";   //  message
    if (err) {
        res.locals.message = '<div class="alert alert-danger" style="margin-bottom:20px;color:red;">' + err + '</div>';
    }
    next();
});

//-----------------------------------------------------------
var port = process.env.PORT || 1113;
app.listen(port, function () {
    console.log('init express...port', port, 'is ready');
});


// catch 404 and forward to error handler
app.use(function (req, res, next) {
    //res.status(404).send("404!!!Sorry cannot find that page!")
    res.status(404).render("404");
});

app.use(function (err, req, res, next) {
    console.error(err.stack)
    //res.status(500).send("something broken!!!")
    res.status(500).render('error');
});

module.exports = app;
