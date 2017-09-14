/**
 * Created by kxr on 17-7-14.
 */

var express = require('express');
var router = express.Router();
var sqlite3 = require('sqlite3').verbose();
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({extended: false});


router.get('/', function (req, res) {
    res.render('topic');
});
Number.prototype.padLeft = function (base, chr) {
    var len = (String(base || 10).length - String(this).length) + 1;
    return len > 0 ? new Array(len).join(chr || '0') + this : this;
}
router.post('/checktopic', urlencodedParser, function (req, res) {
    console.log(req.body);
    var topictitle = req.body.topictitle;
    checkTopicCanBeRegistered(topictitle, function (qes) {
        console.log("check topic---", qes);
        if (qes) {
            res.send("true");
        } else {
            res.send("false");
        }
    });

});
router.post('/addtopic', urlencodedParser, function (req, res) {
    console.log(req.body);

    if (req.session.username) {
        var db = new sqlite3.Database('Mydb.db');
        var topictitle = req.body.topictitle;
        var creator = req.session.userid;
        console.log(req.session.userid);
        var tags = req.body.tags;
        var topic_dicription = req.body.topic_dicription;
        var topic_code = req.body.topic_code;
        var d = new Date,
            createtime = [d.getFullYear(),
                    (d.getMonth() + 1).padLeft(),
                    d.getDate().padLeft()
                ].join('/') + ' ' +
                [d.getHours().padLeft(),
                    d.getMinutes().padLeft(),
                    d.getSeconds().padLeft()].join(':');


        db.run("INSERT INTO Topic(title,createtime,creator,tags,likes,description,code) VALUES (?,?,?,?,?,?,?)",
            topictitle, createtime, creator, tags, 0, topic_dicription, topic_code, function (err) {
                if (err) {
                    console.log("insert topic err->", err);
                    res.send(JSON.stringify({result: false, detail: "database error"}));
                } else {
                    res.send(JSON.stringify({result: true}));
                }
            });
        db.close();
    }
    else {
        res.send("false");
    }

});
function checkTopicCanBeRegistered(topictitle, callback) {
    var db = new sqlite3.Database('Mydb.db');
    console.log("enter checkTopicCanBeRegistered");
    db.serialize(function () {
        var sql = db.prepare("SELECT * FROM Topic WHERE title = $topic");
        sql.get({$topic: topictitle}, function (err, row) {
            if (err) {
                console.log("database error->", err);
                callback(false);
            } else {
                //console.log("row->",row);
                if (row === undefined || row.length === 0) {
                    callback(true);
                } else {
                    callback(false);
                }
            }
        });
        sql.finalize();
    });
    db.close();
}

module.exports = router;