var express = require('express')
var router = express.Router()
var sqlite3 = require('sqlite3').verbose();
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({extended: false});
var db = new sqlite3.Database('Mydb.db');

var currentPid;
var topic_id,current_parent;
// middleware that is specific to this router
router.use(function timeLog (req, res, next) {
    console.log('Time: ', Date.now())
    next();
})

/* GET reply page. */
function post_detail(req, res, next) {
    var pid=req.query.id;
    if(isEmptyObject(pid)){
        console.log("not find that id of post!");
        res.render('index');
    }
    currentPid=pid;
    var dbRequest = 'SELECT * FROM Users inner join Post on uid=creator where pid ='+pid;
    db.all(dbRequest, function(error, rows) {

        if (error || !rows.length) {
            console.log("post_detail err->",error);
            res.render('index');
        }
        req.post_detail = rows[0];
        topic_id=rows[0].topicid;
        current_parent=rows[0].parent;
        return next();
    });
}
function topic_detail(req, res, next) {
    var dbRequest = "SELECT * FROM Users inner join Topic on uid=creator where tid = "+topic_id;
    db.all(dbRequest, function(error, rows) {
        if (error || !rows.length) {
            console.log("topic_detail err->",error);
            res.render('index');
        }
        req.topic_detail = rows[0];

        return next();
    });
}
function children(req, res, next) {
    var dbRequest = "SELECT * FROM Users inner join Post on uid=creator where topicid="+topic_id +
        " and parent ="+currentPid +" order by pid";
    db.all(dbRequest, function(error, rows) {
        if (error) {
            console.log("children err->",error);
            res.render('index');
        }
        req.children = rows;

        return next();
    });
}
function samelevel(req, res, next) {
    var dbRequest = "SELECT * FROM Users inner join Post on uid=creator where topicid="+topic_id +" and parent ="+current_parent;
    db.all(dbRequest, function(error, rows) {
        if (error) {
            console.log("samelevel err->",error);
            res.render('index');
        }
        req.samelevel = rows;

        return next();
    });
}
function count_allreply(req, res, next) {
    var dbRequest = "SELECT count(pid) AS sum_posts FROM Post WHERE topicid="+topic_id +" and parent ="+currentPid;
    db.all(dbRequest, function(error, rows) {
        if (error || !rows.length) {
            console.log("count_allreply err->",error);
            res.render('index');
        }
        req.count_allreply = rows[0];

        return next();
    });
}
function lastversioncode(req, res, next) {
    var dbRequest;
    if(current_parent!=0) {
        dbRequest = "SELECT code FROM Post WHERE pid=" + current_parent;
    }
    else {
        dbRequest = "SELECT code FROM Topic WHERE tid=" + topic_id;
    }
        db.all(dbRequest, function (error, rows) {
            if (error || !rows.length) {
                console.log("count_allreply err->", error);
                res.render('index');
            }
            req.lastversioncode = rows[0];

            return next();
        });


}

function range(req, res, next) {
    var dbRequest = "SELECT count(pid)AS range FROM Post WHERE topicid="+topic_id +" and pid <="+currentPid;
    db.all(dbRequest, function(error, rows) {
        if (error || !rows.length) {
            console.log("range err->",error);
            res.render('index');
        }
        req.range = rows[0];

        next();
    });
}
function renderPage(req, res) {
    res.render('reply', {
        "post_detail":req.post_detail,
        "topic_detail":req.topic_detail,
        "children":req.children,
        "samelevel": req.samelevel,
        "count_allreply": req.count_allreply,
        "range": req.range,
        "lastcode":req.lastversioncode
    });
}

// define the home page route
router.get('/', post_detail,topic_detail,children,samelevel,count_allreply,lastversioncode,range,renderPage);

function isEmptyObject(obj) {
    if (obj) {
        return !Object.keys(obj).length;
    }
    return true;
}
// like a comment
router.get('/addlikeReply', urlencodedParser, function (req, res) {
    var pid=req.query.pid;
    console.log("likecomment->comment_id:", pid);
    db.run("UPDATE Post SET likes = likes + 1 WHERE pid = ?",
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
router.post('/submit', urlencodedParser, function (req, res) {
    console.log(req.body);
    if (req.session.username) {
        var creatorid = req.session.userid;
        console.log(req.session.userid);
        var code = req.body.replycode;
        var explain = req.body.replycomment;
        var topicid = req.body.topicid;
        var parentid = req.body.parent;
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
        console.log("---------------code:" + code);
        console.log("---------------explain:" + explain);

        db.run("INSERT INTO Post(topicid,createtime,creator,likes,parent,explain,code) VALUES (?,?,?,?,?,?,?)",
            topicid, createtime, creatorid, 0, parentid, explain, code, function (err) {
                if (err) {
                    console.log("insert reply err->", err);
                    res.send(JSON.stringify({result: false, detail: "database error"}));
                } else {
                    res.send(JSON.stringify({result: true}));
                    //$('#message-sent').val("send susessfully!");
                }
            });
    }

});
module.exports = router
