var express = require('express')
var router = express.Router()
var sqlite3 = require('sqlite3').verbose();
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({extended: false});


var currenttid;
var Handlebars = require('handlebars');

Handlebars.registerHelper("inc", function(value, options)
{
    return parseInt(value) + 1;
});
// middleware that is specific to this router
// define the home page route
router.get('/', function (req, res) {
    var tid=req.query.id;
    currenttid=tid;
  console.log(">>>>>find tid:"+tid);
  if(isEmptyObject(tid)){
    console.log("not find that id of topic!");
    res.render('/');
  }
  else {
      var db = new sqlite3.Database('Mydb.db');
      var topic_detail = {};
      db.serialize(function() {
          var topic_infor_query = db.prepare("SELECT * FROM Users inner join Topic   on uid=creator where tid = $tid");
          //console.log(">>>>>test");
          topic_infor_query.get({$tid: tid}, function (err, row) {

              if (!err && row) {
                  console.log(JSON.stringify(row));
                  topic_detail['tid'] = row.tid;
                  topic_detail['title'] = row.title;
                  topic_detail['createtime'] = row.createtime;
                  topic_detail['creator'] = row.username;
                  topic_detail['description'] = row.description;
                  topic_detail['likes'] = row.likes;
                  topic_detail['code'] = row.code;
                  topic_detail['answer']=row.answer;
              } else {
                  console.log("SELECT err->", err);
                  res.render('/');
              }
          });
          topic_infor_query.finalize();

          var children_replies = db.prepare("select pid,username,parent from Post inner join Users on creator=uid " +
              "where parent=0 and topicid=$tid order by pid ;");
          var children_replies_r;
          children_replies.all({$tid: tid}, function (err, qres) {
              //console.log("qres---------->", qres);
              console.log("topic_detail----------->", topic_detail);
              children_replies_r=qres;
          });
          children_replies.finalize();

          var stmt = db.prepare("SELECT count(pid)AS sum_posts FROM Post WHERE topicid = '" + tid + "'");
          var pnum;
          stmt.get(function (err, pnumber) {
              console.log("pnumber->", pnumber);
              pnum=pnumber;
          });
          stmt.finalize();

          var allpost = db.prepare("select * from Post inner join Users on creator=uid " +
                  "where topicid=$tid order by pid");

          allpost.all({$tid: tid}, function (err, allposts) {
                  console.log("allposts---------->", allposts);
                  res.render('single', {
                      'topic_detail': topic_detail,
                      'children_replies': children_replies_r,
                      'post_sum': pnum,
                      'allpost': allposts,
                  });
              });
          allpost.finalize();

      });
      db.close();
  }

});


//add comment to current post
Number.prototype.padLeft = function(base,chr){
    var  len = (String(base || 10).length - String(this).length)+1;
    return len > 0? new Array(len).join(chr || '0')+this : this;
}
router.post('/submit', urlencodedParser, function (req, res) {
    console.log(req.body);
    if (req.session.username) {
        var creatorid = req.session.userid;
        console.log(req.session.userid);
        var code = req.body.replycode;
        var explain = req.body.replycomment;
        var topicid = req.body.topicid;
        var parentid = req.body.parent;
        var strategy =req.body.strategy;
        var d = new Date,
            createtime = [d.getFullYear(), (d.getMonth() + 1).padLeft(), d.getDate().padLeft()].join('/') + ' ' +
                [d.getHours().padLeft(), d.getMinutes().padLeft(), d.getSeconds().padLeft()].join(':');
        console.log("---------------topicid:" + topicid);
        console.log("---------------creatorid:" + creatorid);
        console.log("---------------strategy:" + strategy);
        console.log("---------------code:" + code);
        console.log("---------------explain:" + explain);
        var db = new sqlite3.Database('Mydb.db');
        db.serialize(function() {
            db.run("INSERT INTO Post(topicid,createtime,creator,likes,parent,strategy,explain,code) VALUES (?,?,?,?,?,?,?,?)",
                topicid, createtime, creatorid, 0, parentid,strategy, explain, code, function (err) {
                    if (err) {
                        console.log("insert reply err->", err);
                        res.send(JSON.stringify({result: false, detail: "database error"}));
                    } else {
                        res.send(JSON.stringify({result: true}));
                        //$('#message-sent').val("send susessfully!");
                    }
                });
        });
        db.close();
    }
});
// update topic text
router.post('/UpdateTxt', urlencodedParser, function (req, res) {
    console.log(req.body);
    if (req.session.username) {

        var description = req.body.updateContent;
        var topicid = req.body.topicid;
        var parentid = req.body.parent;
        var db = new sqlite3.Database('Mydb.db');
        db.serialize(function() {
            db.run(" UPDATE Topic SET description =?  WHERE tid=?",
                description, topicid, function (err) {
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
// update topic code
router.post('/UpdateCode', urlencodedParser, function (req, res) {
    console.log(req.body);
    if (req.session.username) {
        var code = req.body.updateContent;
        var topicid = req.body.topicid;
        var db = new sqlite3.Database('Mydb.db');
        db.serialize(function() {
            db.run(" UPDATE Topic SET code =?  WHERE tid=?",
                code, topicid, function (err) {
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
// like a comment
router.get('/addlikeTopic', urlencodedParser, function (req, res) {
    var tid=req.query.tid;
    console.log("likecomment->comment_id:", tid);
    var db = new sqlite3.Database('Mydb.db');
    db.serialize(function() {
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
    db.close();
});


// define the about route

function isEmptyObject(obj) {
    if (obj) {
        return !Object.keys(obj).length;
    }
    return true;
}


module.exports = router;
