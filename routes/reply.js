var express = require('express')
var router = express.Router()
var sqlite3 = require('sqlite3').verbose();
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({extended: false});
var db = new sqlite3.Database('Mydb.db');

var currentPid;
var topic_id;
// middleware that is specific to this router
router.use(function timeLog (req, res, next) {
    console.log('Time: ', Date.now())
    next();
})

/* GET reply page. */
function new_list(req, res, next) {
    var pid=req.query.id;
    currentPid=pid;
    var dbRequest = 'SELECT * FROM Users inner join Post on uid=creator where pid ='+pid;
    db.all(dbRequest, function(error, rows) {

        if (error || !rows.length) {
            console.log("err->",err);
            res.render('/');
        }
        req.newest = rows;
        return next();
    });
}

// define the home page route
router.get('/', function (req, res) {
    var pid=req.query.id;
    currentPid=pid;
    console.log(">>>>>find pid:"+pid);
    if(isEmptyObject(pid)){
        console.log("not find that id of post!");
        res.render('index');
    }
    else {
        var post_infor_query = db.prepare("SELECT * FROM Users inner join Post on uid=creator where pid = $pid");
        //console.log(">>>>>test");
        post_infor_query.get({$tid:pid}, function (err, row) {
            var post_detail = {};
            if (!err && row) {
                console.log(JSON.stringify(row));
                post_detail['pid'] = row.pid;
                post_detail['createtime'] = row.createtime;
                post_detail['creator'] = row.username;
                post_detail['description'] = row.explain;
                post_detail['likes'] = row.likes;
                post_detail['code'] = row.code;
                post_detail['parent']=row.parent;
                post_detail['topicid']=row.topicid;
                topic_id=row.topicid;
                var children_replies = db.prepare("select pid,username,parent from Post inner join Users on creator=uid " +
                    "where parent=0 and topicid=$pid order by pid ;"
                ); /*
                 "select pid, username,parent from Post " +
                 "INNER JOIN Users ON Post.creator=Users.uid" +
                 "where parent=0 and pid= $pid ORDER BY pid desc"*/

                children_replies.all({$tid:pid}, function (err, qres) {
                    console.log("qres->", qres);
                    console.log("post_detail->", JSON.stringify(post_detail));
                    var stmt = db.prepare("SELECT count(pid)AS sum_posts FROM Post WHERE topicid = '"+pid+"'");
                    stmt.get(function(err,pnumber){
                        console.log("pnumber->",pnumber);
                        //var round_avgrank = Math.round(pnumber.avg_rank);
                        res.render('single', {
                            'post_detail': post_detail,
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
        currentPid, function (err) {
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
