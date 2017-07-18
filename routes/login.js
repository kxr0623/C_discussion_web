var sqlite3 = require('sqlite3').verbose();
var express = require('express');
//var app = express();
var router = express.Router();
var bodyParser = require('body-parser');

var urlencodedParser = bodyParser.urlencoded({ extended: false })

var crypto = require('crypto');
var dateFormat = require('dateformat');
var now = new Date();
var salt = "t{Z@WLoJ"; // encrypt the password: md5(originalpassword+salt)
/*var algorithm = 'aes-256-ctr',
    pas = '@p4gt)Ox';// encrypt the cookie*/

    // to page log in
router.get('/', function (req, res) {
        res.render('login');
    });

    // to cookie username
router.get('/getcookie', function (req, res) {
        console.log("/login/getcookie");
        if (req.session.username) {
            console.log(req.cookies);
            res.send(req.session.username);
        } else {
            res.send("");
        }
    });

    // to checkIsLogin
router.get('/checkIsLogin', function (req, res) {
        console.log("/login/checkIsLogin");
        if (req.session.username) {
            //console.log(req.cookies);
            res.send("true");
        } else {
            res.send("false");
        }
    });
    // submit log in ajax
router.post('/',urlencodedParser, function (req, res) {
        console.log(req.body);

        var username = req.body.userName.trim();
        var password = req.body.password.trim();

        if (req.session.username && req.session.username === username) {
            //console.log(req.cookies);
            console.log("--------already login");
            res.send("true");
            //res.sendStatus(200);
            return;
        }

        var md5 = crypto.createHash('md5');
        //var passwordmd5 = md5.update(password+salt).digest('base64');
        //console.log("passwordmd5->",passwordmd5);
        var db = new sqlite3.Database('Mydb.db');
        db.serialize(function() {
            var stmt = db.prepare("SELECT * FROM Users WHERE username = $username AND password = $password");
            stmt.all({$username:username, $password:password},function(err,row){
                if(err) {
                    console.log("err->",err);
                    res.sendStatus(404);
                } else {
                    console.log("row->",row);
                    if(row === undefined || row.length===0) {
                        res.sendStatus(404);

                    } else {
                        sess=req.session;
                        sess.username = username;
                        sess.userid = parseInt(row[0].uid,10);

                        //res.render('index');
                        console.log("log in susess--------------------"+sess.userid);
                        // res.sendStatus(200);
                        res.send("true");
                    }
                }
            });
            stmt.finalize();

        });
        db.close();

    });

module.exports = router;
