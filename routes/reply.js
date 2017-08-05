var express = require('express')
var router = express.Router()
var sqlite3 = require('sqlite3').verbose();
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({extended: false});

var currentPid;
var topic_id,current_parent;
// middleware that is specific to this router
router.use(function timeLog (req, res, next) {
    console.log('Time: ', Date.now())
    next();
})

/* GET reply page. */
router.get('/', function (req, res) {
    var db = new sqlite3.Database('Mydb.db');

    var pid=req.query.id;
    currentPid=pid;
    currenttid=pid;
    console.log(">>>>>find pid:"+pid);
    if(isEmptyObject(pid)){
        console.log("not find that id of topic!");
        res.render('/');
    }
    else {
        var post_infor_query = db.prepare("SELECT * FROM Users inner join Post on uid=creator where pid = $pid");
        //console.log(">>>>>test");
        post_infor_query.get({$pid:pid}, function (err, p_detail) {
            var post_detail = {};
            if (!err && p_detail) {
                console.log("post detail------------>",p_detail);
                post_detail['pid'] = p_detail.pid;
                post_detail['createtime'] = p_detail.createtime;
                post_detail['username'] = p_detail.username;
                post_detail['explain'] = p_detail.explain;
                post_detail['likes'] = p_detail.likes;
                post_detail['code'] = p_detail.code;
                post_detail['topicid'] = p_detail.topicid;
                post_detail['parent'] = p_detail.parent;
                topic_id=p_detail.topicid;
                current_parent=p_detail.parent;
                console.log("topic_id----------->", topic_id);
                var t_detailSql = db.prepare("SELECT * FROM Users inner join Topic on uid=creator where tid =$tid");
                t_detailSql.all({$tid:topic_id}, function (err, topicdetail) {
                    console.log("topic_detail----------->", topicdetail);

                    var childrensql = db.prepare("SELECT * FROM Users inner join Post on uid=creator " +
                        "where topicid=$tid and parent =$parent order by pid");
                    childrensql.all({$tid:topic_id,$parent:currentPid},function(err,children){
                        console.log("children->",children);

                        var smlevelSql=db.prepare("SELECT * FROM Users inner join Post on uid=creator where topicid=$tid and parent =$parent");
                            smlevelSql.all({$tid:topic_id,$parent:current_parent},function (err,samelevel) {
                                console.log("samelevel->",samelevel);

                                var count_allpost=db.prepare("SELECT count(pid) AS sum_posts FROM Post WHERE topicid=$tid"+
                                    " and parent =$pid");
                                    count_allpost.all({$tid:topic_id,$pid:currentPid}, function (err, count_allreply) {
                                        console.log("count_allpost---------->", count_allreply);


                                        var lastversioncodeSql; var id;
                                        if(current_parent!=0) {
                                            lastversioncodeSql = db.prepare("SELECT code FROM Post WHERE pid=$id" );
                                            id=parseInt(current_parent,10);
                                        }
                                        else {
                                            lastversioncodeSql =db.prepare( "SELECT code FROM Topic WHERE tid=$id");
                                            id=parseInt(topic_id,10);
                                        }
                                        lastversioncodeSql.all({$id:id},function (err,lastversioncode) {
                                            console.log("lastversioncode---------->", lastversioncode);

                                            var rangeSql = db.prepare("SELECT count(pid) AS range FROM Post WHERE topicid="+topic_id +" and pid <="+currentPid);
                                            rangeSql.all(function (err,range) {
                                                console.log("rangeSql---------->", range);

                                                var allpostSql=db.prepare("select * from Post inner join Users on creator=uid " +
                                                    "where topicid=$tid order by pid");
                                                allpostSql.all({$tid:topic_id},function (err,allpost) {
                                                    console.log("allpost---------->", allpost);

                                                    res.render('reply', {
                                                        "post_detail":post_detail,
                                                        "topic_detail":topicdetail[0],
                                                        "children":children,
                                                        "samelevel": samelevel,
                                                        "count_allreply": count_allreply[0],
                                                        "range": range[0],
                                                        "lastcode":lastversioncode[0],
                                                        "allpost":allpost
                                                    });

                                                });
                                                allpostSql.finalize();
                                            });
                                            rangeSql.finalize();
                                         });
                                        lastversioncodeSql.finalize();
                                    });
                                count_allpost.finalize();
                            });
                        smlevelSql.finalize();
                    });
                    childrensql.finalize();

                });
                t_detailSql.finalize();
            } else {
                console.log("render err->", err);
                res.render('/');
            }
        });
        post_infor_query.finalize();
    }
    db.close();
});

function isEmptyObject(obj) {
    if (obj) {
        return !Object.keys(obj).length;
    }
    return true;
}
// like a comment
router.get('/addlikeReply', urlencodedParser, function (req, res) {
    var db = new sqlite3.Database('Mydb.db');
    var pid=req.query.pid;
    console.log("likecomment->comment_id:", currentPid);
    //db.run("BEGIN TRANSACTION")
    db.run("UPDATE Post SET likes = likes + 1 WHERE pid = ?;",
        currentPid, function (err) {
            if (err) {
               // db.run("ROLLBACK");
                console.log("database err->",err);
                res.send(JSON.stringify({result: false, detail: "database error:"+err}));
            } else {
               // db.run("COMMIT");
                res.send(JSON.stringify({result: true}));
            }
        });
    db.close();
});
// define the about route
router.get('/test', function (req, res) {
    res.send('About birds')
})
router.post('/submit', urlencodedParser, function (req, res) {
    console.log(req.body);
    var db = new sqlite3.Database('Mydb.db');
    if (req.session.username) {
        var creatorid = req.session.userid;
        console.log(req.session.userid);
        var code = req.body.replycode;
        var explain = req.body.replycomment;
        var topicid = req.body.topicid;
        var parentid = req.body.parent;
        var strategy=req.body.strategy;
        var d = new Date,
            createtime = [d.getFullYear(),
                    (d.getMonth() + 1).padLeft(),
                    d.getDate().padLeft()
                ].join('/') + ' ' +
                [d.getHours().padLeft(),
                    d.getMinutes().padLeft(),
                    d.getSeconds().padLeft()].join(':');
        console.log("---------------topicid:" + topicid);
        console.log("---------------creatorid:" + creatorid);
        console.log("---------------strategy:" + strategy);
        console.log("---------------code:" + code);
        console.log("---------------explain:" + explain);
       // db.run("BEGIN TRANSACTION");
        db.run("INSERT INTO Post(topicid,createtime,creator,likes,parent,strategy,explain,code) VALUES (?,?,?,?,?,?,?,?)",
            topicid, createtime, creatorid, 0, parentid,strategy, explain, code, function (err) {
                if (err) {
                   // db.run("ROLLBACK");
                    console.log("insert reply err->", err);
                    res.send(JSON.stringify({result: false, detail: "database error:"+err}));

                } else {
                  //  db.run("COMMIT");
                    res.send(JSON.stringify({result: true}));
                }
            });

    }
    db.close();

});
// update post text
router.post('/UpdateTxt', urlencodedParser, function (req, res) {
    console.log(req.body);
    if (req.session.username) {

        var explain = req.body.updateContent;
        var postid = req.body.pid;
        var parentid = req.body.parent;
        var db = new sqlite3.Database('Mydb.db');
        db.serialize(function() {
            db.run(" UPDATE Post SET explain =?  WHERE pid=?",
                explain, postid, function (err) {
                    if (err) {
                        console.log("UPDATE text err->", err);
                        res.send(JSON.stringify({result: false, detail: "database error"}));
                    } else {
                        res.send(JSON.stringify({result: true}));
                        //$('#message-sent').val("send susessfully!");
                    }
                });
        });
        db.close();
    }
    else res.send(JSON.stringify({result: false, detail: "not sign in."}));
});
// update post code
router.post('/UpdateCode', urlencodedParser, function (req, res) {
    console.log(req.body);
    if (req.session.username) {
        var code = req.body.updateContent;
        var pid = req.body.pid;
        var db = new sqlite3.Database('Mydb.db');
        db.serialize(function() {
            db.run(" UPDATE Post SET code =?  WHERE pid=?",
                code, pid, function (err) {
                    if (err) {
                        console.log("UPDATE code err->", err);
                        res.send(JSON.stringify({result: false, detail: "database error"}));
                    } else {
                        res.send(JSON.stringify({result: true}));
                        //$('#message-sent').val("send susessfully!");
                    }
                });
        });
        db.close();
    }
    else res.send(JSON.stringify({result: false, detail: "not sign in."}));
});
//receive a post
router.post('/answer_receive',urlencodedParser,function (req,res) {
    console.log(req.body);
    if (req.session.username) {
        var pid = req.body.pid;
        var tid = req.body.tid;
        var db = new sqlite3.Database('Mydb.db');
        db.serialize(function() {
            db.run(" UPDATE Topic SET answer =?  WHERE tid=?",
                pid,tid, function (err) {
                    if (err) {
                        console.log("Set Answer err->", err);
                        res.send(JSON.stringify({result: false, detail: "database error"}));
                    } else {
                        res.send(JSON.stringify({result: true}));
                    }
                });
        });
        db.close();
    }
    else res.send(JSON.stringify({result: false, detail: "not sign in."}));

});
module.exports = router;
