var sqlite3 = require('sqlite3').verbose();
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false })

var crypto = require('crypto');
var end_pw = "X?R,K"; // encrypt the password

    // to page sign up
    app.get('/', function (req, res) {
        res.render('signup');
    });
    // check whether the username has been registered
    app.post('/checkusername',urlencodedParser, function (req, res) {
        console.log(req.body);
        var username = req.body.userName;
        checkUserNameCanBeRegistered(username, function(qes) {
            console.log("checkusername---",qes);
            if(qes) {
                res.send("true");
            } else {
                res.send("false");
            }
        });

    });
    // submit sign up form
    app.post('/submitsignup',urlencodedParser, function (req, res) {
        console.log(req.body);
        var username = req.body.userName.trim();
        var password = req.body.password.trim();
        var email = req.body.email.trim();

        var md5 = crypto.createHash('md5');
        var password_md5 = md5.update(password+end_pw).digest('base64');
        console.log("password->",password_md5);
        var db = new sqlite3.Database('Mydb.db');
        db.serialize(function() {
            db.run("INSERT INTO Users(username,password,email) VALUES (?,?,?)",
                username, password_md5, email, function (err) {
                    if (err) {
                        console.log("INSERT INTO Users err->", err);
                        res.send(false);
                    } else {
                        // res.sendStatus(200);
                        res.send(true);
                        console.log("sign up susess--------------------");
                    }
                });
        });
        db.close();
    });

    // to checkIsLogin
    app.get('/checkIsLogin', function (req, res) {
        console.log("/login/checkIsLogin");
        if (req.session.username) {
            //console.log(req.cookies);
            res.send("true");
        } else {
            res.send("false");
        }
    });

    function checkUserNameCanBeRegistered(userName, callback) {
        console.log("enter checkUserNameCanBeRegistered");
        var db = new sqlite3.Database('Mydb.db');
        db.serialize(function() {
            var sql = db.prepare("SELECT * FROM Users WHERE username = $username");
            sql.get({$username:userName},function(err,row){
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

module.exports = app;
