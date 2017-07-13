let sqlite3 = require('sqlite3')

function DbQuery() {

    return new Promise(execute)

    function execute (resolve, reject) {
        var text = ''
        var db = new sqlite3.Database('./Mydb')
        db.serialize(function () {
            db.run("DROP  TABLE IF EXISTS lorem ");

            db.each("SELECT id, username,password FROM Users", function (err, row) {
                console.log(row.id + ": " + row.username+": " + row.password);
                text += row.id + ": " + row.username+ ": " + row.password + '<br>'
            }, () => resolve(text));
        });
        db.close();
    }

}

module.exports = DbQuery