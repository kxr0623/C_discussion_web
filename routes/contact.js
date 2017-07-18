/**
 * Created by kxr on 17-7-7.
 */
var express = require('express');
var router = express.Router();
var sqlite3 = require('sqlite3').verbose();
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({extended: false});

router.get('/',function (req,res) {
        res.render('contact');
});
Number.prototype.padLeft = function(base,chr){
    var  len = (String(base || 10).length - String(this).length)+1;
    return len > 0? new Array(len).join(chr || '0')+this : this;
}

router.post('/addcontact', urlencodedParser, function (req, res) {
    var db = new sqlite3.Database('Mydb.db');

    console.log(req.body);

        var title = req.body.title;
        //var createtime = req.body.createtime;
        var creator = req.body.creator;
        var email = req.body.email;
        var description = req.body.description;
        var d = new Date,
            createtime = [ d.getFullYear(),
                        (d.getMonth()+1).padLeft(),
                        d.getDate().padLeft()
                        ].join('/')+ ' ' +
                      [ d.getHours().padLeft(),
                        d.getMinutes().padLeft(),
                        d.getSeconds().padLeft()].join(':');


        db.run("INSERT INTO Contact(title,createtime,creator,email,description) VALUES (?,?,?,?,?)",
            title, createtime, creator, email, description, function (err) {
                if (err) {
                    console.log("insert comment err->",err);
                    res.send(JSON.stringify({result: false, detail: "database error"}));
                } else {
                    res.send(JSON.stringify({result: true}));
                    //$('#message-sent').val("send susessfully!");
                }
            });
        db.close()

});


module.exports = router;