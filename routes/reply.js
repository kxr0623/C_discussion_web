var express = require('express')
var router = express.Router()
var sqlite3 = require('sqlite3').verbose();
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({extended: false});
var db = new sqlite3.Database('Mydb.db');

var currenttid;
// middleware that is specific to this router
router.use(function timeLog (req, res, next) {
    console.log('Time: ', Date.now())
    next();
})
// define the home page route
router.get('/', function (req, res) {
    var tid=req.query.id;
    currenttid=tid;
    console.log(">>>>>find tid:"+tid);
    if(isEmptyObject(tid)){
        console.log("not find that id of topic!");
        res.render('index');
    }
    else {
        var topic_infor_query = db.prepare("SELECT * FROM Users inner join Topic   on uid=creator where tid = $tid");
        //console.log(">>>>>test");
        topic_infor_query.get({$tid:tid}, function (err, row) {
            var topic_detail = {};
            if (!err && row) {
                console.log(JSON.stringify(row));
                topic_detail['tid'] = row.tid;
                topic_detail['title'] = row.title;
                topic_detail['createtime'] = row.createtime;
                topic_detail['creator'] = row.username;
                topic_detail['description'] = row.description;
                topic_detail['likes'] = row.likes;
                topic_detail['code'] = row.code;

                var children_replies = db.prepare("select pid,username,parent from Post inner join Users on creator=uid " +
                    "where parent=0 and topicid=$tid order by pid ;"
                ); /*
                 "select pid, username,parent from Post " +
                 "INNER JOIN Users ON Post.creator=Users.uid" +
                 "where parent=0 and tid= $tid ORDER BY pid desc"*/

                children_replies.all({$tid:tid}, function (err, qres) {
                    console.log("qres->", qres);
                    console.log("topic_detail->", JSON.stringify(topic_detail));
                    var stmt = db.prepare("SELECT count(pid)AS sum_posts FROM Post WHERE topicid = '"+tid+"'");
                    stmt.get(function(err,pnumber){
                        console.log("pnumber->",pnumber);
                        //var round_avgrank = Math.round(pnumber.avg_rank);
                        res.render('single', {
                            'topic_detail': topic_detail,
                            'children_replies': qres,
                            'post_sum':pnumber,

                        });
                    });
                    stmt.finalize();

                });
            } else {
                console.log("err->", err);
                res.render('index');
            }
        });
    }

});
function isEmptyObject(obj) {
    if (obj) {
        return !Object.keys(obj).length;
    }
    return true;
}
// like a comment
router.get('/addlikeTopic', urlencodedParser, function (req, res) {
    var tid=req.query.tid;
    console.log("likecomment->comment_id:", tid);
    db.run("UPDATE Topic SET likes = likes + 1 WHERE tid = ?",
        currenttid, function (err) {
            if (err) {
                console.log("database err->",err);
                res.send(JSON.stringify({result: false, detail: "database error"}));
            } else {
                res.send(JSON.stringify({result: true}));
            }
        });
});
// define the about route
router.get('/test', function (req, res) {
    res.send('About birds')
})

module.exports = router
