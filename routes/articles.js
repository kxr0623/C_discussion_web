/**
 * Created by kxr on 17-8-10.
 */
var express = require('express');
var router = express.Router();
var sqlite3 = require('sqlite3').verbose();
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({extended: false});

var requestTime = function (req, res, next) {
    req.requestTime = Date.now()
    next()
};

var path = __dirname + '/views/';
router.use(requestTime)
/* GET home page. */
function new_list(req, res, next) {
    var db = new sqlite3.Database('Mydb.db');
    var dbRequest = 'SELECT * FROM Article Inner Join Users on creator=uid  ORDER BY createtime DESC ';
    db.all(dbRequest, function (error, rows) {
        if (!rows.length) {
            req.newest = rows;
            // res.render('/');
        }
        if (error) {
            console.log("err->", error);
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
        "FROM Article Inner Join Users on creator=uid  ORDER BY likes DESC";
    db.all(dbRequest, function (error, rows) {
        if (error) {
            console.log("err->", error);
            //res.render('/');
        }
        /* Add selected data to previous saved data. */
        else {
            req.pop = rows;
            return next();
        }
    });
    db.close();
}
function count_articles(req, res, next) {
    var db = new sqlite3.Database('Mydb.db');
    dbRequest = 'select count(aid) sum from Article';
    db.all(dbRequest, function (err, rows) {
        if (err) {
            console.log("err->", err);
            res.render('/');
        }
        else {
            req.count = rows;
            next();
        }
    });
    db.close();
}
function renderArticlePage(req, res) {
    res.render('articles-list', {
        "newest": req.newest,
        "pop": req.pop,
        "sumArticles": req.count
    });
}
router.get('/', new_list, pop_list, count_articles, renderArticlePage);

router.get('/search', urlencodedParser, function (req, res) {
    var db = new sqlite3.Database('Mydb.db');
    var search_string = req.query.search_string;
    var stmt = db.prepare("SELECT tid,title FROM Topic WHERE title LIKE $search_string");
    stmt.get({$search_string: "%" + search_string + "%"}, function (err, row) {
        if (err) {
            console.log("database err->", err);
            res.send(JSON.stringify({result: false, detail: "database error"}));
        } else {
            console.log("search tid->", row);
            if (row !== undefined) {
                res.send(JSON.stringify({result: true, detail: row.title}));
            } else {
                res.send(JSON.stringify({result: false}));
            }

        }
    });
    stmt.finalize();
    db.close();
});

module.exports = router;
