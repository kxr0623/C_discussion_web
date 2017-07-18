var express = require('express');
var router = express.Router();
var sqlite3 = require('sqlite3').verbose();
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({extended: false});


var requestTime = function (req, res, next) {
  req.requestTime = Date.now()
  next()
}

var path=__dirname + '/views/';
router.use(requestTime)
/* GET home page. */
function new_list(req, res, next) {
    var db = new sqlite3.Database('Mydb.db');
    var dbRequest = 'SELECT * FROM Topic Inner Join Users on creator=uid  ORDER BY createtime DESC ';
    db.all(dbRequest, function(error, rows) {

        if (error || !rows.length) {
            console.log("err->",err);
            res.render('/');
        }
        req.newest = rows;
        return next();
    });
    db.close();
}

function pop_list(req, res, next) {
    var db = new sqlite3.Database('Mydb.db');
    dbRequest = "SELECT * " +
        "FROM Topic Inner Join Users on creator=uid  ORDER BY likes DESC";
    db.all(dbRequest, function(error, rows) {
        if(error) {
            console.log("err->",err);
            res.render('/');
        }
        /* Add selected data to previous saved data. */
        else {
            req.pop = rows;
            return next();
        }
    });
    db.close();
}
function count_topics(req, res, next) {
    var db = new sqlite3.Database('Mydb.db');
    dbRequest='select count(tid) sum from Topic';
    db.all(dbRequest,function (err,rows) {
        if(err) {
            console.log("err->",err);
            res.render('/');
        }
        else {
            req.count=rows;
            next();
        }
    });
    db.close();
}
/*function createTB(req,res,next) {
    var tname='newatable';
    dbRequest='create table '+tname+'(pid INTEGER PRIMARY KEY AUTOINCREMENT,code TEXT,'+
        'explain TEXT NOT NULL,'+
        'likes INTEGER NOT NULL,'+
        'createtime DATETIME NOT NULL,'+
        'creator INTEGER NOT NULL,'+
        'topicid INTEGER NOT NULL,'+
        'parent INTEGER NOT NULL,'+
        'FOREIGN KEY (creator) REFERENCES Users(id),'+
        'FOREIGN KEY (topicid) REFERENCES Topic(id));';
    db.all(dbRequest,function (err,rows) {
        if(err){
            console.log("create table err:"+err);
            res.render('/');
        }
        else {
            next();
        }
    })
}

function selectT(req,res) {
    var tname='Topic';

    var topic_infor_query = db.prepare("SELECT * FROM "+tname+" where tid=1 ");
    topic_infor_query.get(function (err, row) {
        var topic_detail = {};

        if (err || !row) {
            console.log("select table err:"+err);
            res.render('/');
        }else {
            console.log('>>>>>>>>>>>>>>>'+tname);
        }
    })

}
*/
function renderIndexPage(req, res) {
    res.render('index', {
        "newest": req.newest,
        "pop": req.pop,
        "sumTopic": req.count
    });
}
router.get('/', new_list, pop_list,count_topics,  renderIndexPage);

function generateQuerySQL( callback) {
        // popular
        callback("SELECT * " +
            "FROM Topic Inner Join Users on creator=uid  ORDER BY likes DESC ");
}

router.get('/articles-list', function(req, res) {
  res.render('articles-list');
});

router.get('/test', function (req, res) {
    const DbQuery = require('./dbconnector');
    DbQuery()
        .then((text) => res.send(text))//sent the data from db to page
        .catch((err) => console.log(err))//else catch an err
})

module.exports = router;
