var sqlite3 = require('sqlite3').verbose();
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false })
var db = new sqlite3.Database('Mydb.db');
var crypto = require('crypto');
var dateFormat = require('dateformat');
var now = new Date();
var salt = "t{Z@WLoJ"; // encrypt the password: md5(originalpassword+salt)
/*var algorithm = 'aes-256-ctr',
    pas = '@p4gt)Ox';// encrypt the cookie*/

    // logout
    app.get('/',urlencodedParser, function (req, res) {
        /*if(req.session.username) {
            res.clearCookie("username");
        }
        if(req.cookies.userid) {
            res.clearCookie("userid");
        }*/
        req.session.destroy(function(err){
            if(err){
                console.log(err);
            }
            else
            {
                res.send("true");
            }
        });

    });

module.exports = app;
