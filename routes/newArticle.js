/**
 * Created by kxr on 17-7-14.
 */

var express = require('express');
var router = express.Router();
var sqlite3 = require('sqlite3').verbose();
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({extended: false});


router.get('/',function (req,res) {
    res.render('newArticle');
});
Number.prototype.padLeft = function(base,chr){
    var  len = (String(base || 10).length - String(this).length)+1;
    return len > 0? new Array(len).join(chr || '0')+this : this;
}
router.post('/checkArticle',urlencodedParser, function (req, res) {
   // console.log(req.body);
    var articletitle = req.body.articletitle;
    checkArticleCanBePost(articletitle, function(qes) {
        console.log("check article---",qes);
        if(qes) {
            res.send("true");
        } else {
            res.send("false");
        }
    });

});
router.post('/addarticle', urlencodedParser, function (req, res) {
   // console.log(req.body);
    if (req.session.username) {
        var db = new sqlite3.Database('Mydb.db');
        var articletitle = req.body.articletitle;
        var creator = req.session.userid; console.log(req.session.userid);
        var tag=req.body.tag;
        var article_content = req.body.article_content;
        var d = new Date,
            createtime = [d.getFullYear(),
                    (d.getMonth() + 1).padLeft(),
                    d.getDate().padLeft()
                ].join('/') + ' ' +
                [d.getHours().padLeft(),
                    d.getMinutes().padLeft(),
                    d.getSeconds().padLeft()].join(':');


        db.run("INSERT INTO Article(title,createtime,creator,tag,likes,content) VALUES (?,?,?,?,?,?)",
            articletitle, createtime, creator,tag, 0, article_content, function (err) {
                if (err) {
                    console.log("insert Article err->", err);
                    res.send(JSON.stringify({result: false, detail: "database error"}));
                } else {
                    res.send(JSON.stringify({result: true}));
                }
            });
        db.close();
    }
    else{
        res.send("false");
    }

});
function checkArticleCanBePost(articletitle, callback) {
    var db = new sqlite3.Database('Mydb.db');
    db.serialize(function() {
        var sql = db.prepare("SELECT * FROM Article WHERE title = $title");
        sql.get({$title:articletitle},function(err,row){
            if(err) {
                console.log("database error->",err);
                callback(false);
            } else {
                //console.log("row->",row);
                if(row === undefined || row.length===0) {
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