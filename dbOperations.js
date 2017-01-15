var dbRowDefinition = require("./serverObjects.js");

function getUserByName(userName) {
    var user = new dbRowDefinition.userRecord('', '', '', '');
    var rows = getRecords('Select * from users where name = \'' + userName + '\';');
              
    if ((rows == null) || (rows.length == 0) || (rows===undefined)) {
         console.log('empty row');
       return user;
    } else {
        var row = rows[0];
        console.log(row.join(' '));
        var user = dbRowDefinition.userRecord(row.mail.trim(), row.name.trim(), row.password.trim(), row.uid.trim());
    }
    return user;
};


function getRecords(req, res) {
    var pg = require('pg');
var returnvalue;
    //You can run command "heroku config" to see what is Database URL from Heroku belt

    pg.defaults.ssl = true;
    pg.connect(process.env.DATABASE_URL, function (err, client) {
        if (err) throw err;
        console.log(req);
        var query = client.query(req);
             console.log('query started');
       query.on('row', function (row, result) {
                        console.log('query result increased');
            result.addRow(row);
  returnvalue= result.rows;
        });

        query.on("end", function (result) {
            // client.end();
            console.log('query finished');
          
        });
    });
return returnvalue;
}

module.exports = {
    changeRecord: function (req, res) {
        var pg = require('pg');

        pg.connect(process.env.DATABASE_URL, function (err, client) {
            if (err) throw err;
            // console.log('Connected to postgres! Getting records...');
            console.log(req);
            var query = client.query(req);

            query.on("end", function (result) {
                client.end();
                console.log('Databasechange with Success');
            });
        });
    },



    deleteUser: function (uid) {
        changeRecord('Delete from tweets where uid = \'' + uid + '\'');
        changeRecord('Delete from followers where vip = \'' + uid + '\' or uid = \'' + uid + '\'');
        changeRecord('Delete from admins where uid = \'' + uid + '\'');
        changeRecord('Delete from users where uid = \'' + uid + '\'');

    },

    editAccount: function (uid, newuserName, newpassword, newmail) {
        var resultUser = new dbRowDefinition.userRecord('', '', '', '');
        var user = importUserByID(uid);
        var alreadyinUse = importUserByName(userName);
        if (alreadyinUse.id == '') {
            changeRecord('Update table users set mail = \' ' + newmail + ' \',password = \'' + newpassword + '  \',name = \'' + newuserName + '  \' where uid =  \' ' + uid + ' \'');
            resultUser = new dbRowDefinition.userRecord(newmail, newpassword, newuserName, uid);
        }
        return resultUser;
    },

    signIn: function (userName, password, mail) {
        var resultUser = new dbRowDefinition.userRecord('', '', '', '');
        var t = getUserByName(userName);// importUserByName(userName);
        if (t.id == '') {
            var uid = mwaToolset.createGuid();
            var qs = 'Insert into users values (\'' + uid + ' \',\'' + mail + ' \',\'' + password + ' \',\'' + name + ' \');';
            console.log(qs);
            //     changeRecord(qs);

            resultUser = new dbRowDefinition.userRecord(mail, password, userName, uid);
        }
        return resultUser;
    },

    importUserByName: function (userName) {
      return getUserByName(userName);
    },

    importUserByID: function (userID) {
        var user = dbRowDefinition.userRecord;
        var rows = getRecords('Select * from users where uid = \'' + userID + '\';');
        if ((rows == null) || (rows.length == 0)) {
            user = new dbRowDefinition.userRecord('','','','');
        } else {
            var row = rows[0];
            var user = dbRowDefinition.userRecord(row.mail, row.name, row.password, row.uid);
        }
        return user;
    },

    importAvailableTweetsInPeriod: function (start, end) {
        importAvailableTweets('*', 'where timestamp >=\'' + start + '\' and timestamp <=\'' + end + '\'');
    },

    importAvailableTweets: function (filter, qback) {
        if (qback == null) {
            qback = ' limit 20';
        }
        var rows;
        var query;
        if (filter == '*') {
            query = 'Select * from tweets ' + qback + ';';
        } else {
            query = 'Select * from tweets where uid = \'' + filter + '\' limit 20;';
        }
        rows = getRecords(query);
        var tweets = new Array();
        for (i = 0; i < rows.length; i++) {
            var tweet = tweetRecord(rows[i].uid, mwaToolset.getDay(rows[i].timestamp), mwaToolset.getTime(rows[i].timestamp), rows[i].message, rows[i].image);
            tweets.push(tweet);
        }
        return tweets;
    },

    getVipTweets: function (followVips) {
        var vipTweets = new Array;
        var qBack;
        if (!followVips) {
            return vipTweets;
        }
        var vip = vipRecord;
        for (var i = 0; i < vips.length; i++) {
            var vip = vips[i];
            if (vip.checked) {
                comparativeValue = vip.id;
                var vipResults = availableTweets.filter(equalsTweetAuthor);
                if (vipResults.length > 0) {
                    qBack = qBack.concat(vipResults, '\' or uid = \'');
                }
            }
        }
        vipTweets = importAvailableTweets('x', qBack);
        return vipTweets;
    }


}
