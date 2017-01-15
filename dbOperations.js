var dbRowDefinition = require("./serverObjects.js");
var toolkit = require("./serverToolkit.js");


function getUserByMail(mail) {
    var user = dbRowDefinition.userRecord('', '', '', '');
    var rows = getRecords('Select * from users where mail = \'' + mail + '\';');

    if ((rows == null) || (rows.length == 0) || (rows === undefined)) {
        console.log('empty row');
        return user;
    } else {
        var row = rows[0];
        console.log(row.join(' '));
        var user = dbRowDefinition.userRecord(row.mail.trim(), row.name.trim(), row.password.trim(), row.uid.trim());
    }
    return user;
};

function getUserByName(userName) {
    var user = dbRowDefinition.userRecord('', '', '', '');
    var rows = getRecords('Select * from users where name = \'' + userName + '\';');

    if ((rows == null) || (rows.length == 0) || (rows === undefined)) {
        console.log('empty row');
        return user;
    } else {
        var row = rows[0];
        console.log(row.join(' '));
        var user = dbRowDefinition.userRecord(row.mail.trim(), row.name.trim(), row.password.trim(), row.uid.trim());
    }
    return user;
};

function getUserByID(userID) {
    var user = dbRowDefinition.userRecord('', '', '', '');
    var rows = getRecords('Select * from users where uid = \'' + userID + '\';');

    if ((rows == null) || (rows.length == 0) || (rows === undefined)) {
        console.log('empty row');
        return user;
    } else {
        var row = rows[0];
        console.log(row.join(' '));
        var user = dbRowDefinition.userRecord(row.mail.trim(), row.name.trim(), row.password.trim(), row.uid.trim());
    }
    return user;
};

function getRecords(query, res) {
    var pg = require('pg');
    var returnvalue;
    //You can run command "heroku config" to see what is Database URL from Heroku belt

    //  pg.defaults.ssl = true;
    pg.connect(process.env.DATABASE_URL, function (err, client, done) {
        client.query(query, function (err, result) {
            done();
            if (err)
            { console.error(err); res.send("Error " + err); }
            else
            { returnvalue = (result.rows); }
        });
    });
    return returnvalue;
}

function changeEntry(query, res) {
    var pg = require('pg');

    pg.connect(process.env.DATABASE_URL, function (err, client, done) {
        client.query(query, function (err, result) {
            done();
            if (err)
            { console.error(err); res.send("Error " + err); }
            else
            { console.log('database change success'); }
        });
    });
}

function getTweets(filter, qback) {
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
            var tweet = tweetRecord(rows[i].uid, toolkit.getDay(rows[i].timestamp), toolkit.getTime(rows[i].timestamp), rows[i].message, rows[i].image);
            tweets.push(tweet);
        }
        return tweets;
}

module.exports = {
    changeRecord: function (query, res, done) {
        changeEntry(query, res, done);
    },

    updateAccount: function (uid, newuserName, newpassword, newmail) {
        var resultUser = dbRowDefinition.userRecord('', '', '', '');
        var user = importUserByID(uid);
        var alreadyinUse = importUserByName(userName);
        if (alreadyinUse.id == '') {
            changeEntry('Update table users set mail = \' ' + newmail + ' \',password = \'' + newpassword + '  \',name = \'' + newuserName + '  \' where uid =  \' ' + uid + ' \'');
            resultUser = dbRowDefinition.userRecord(newmail, newpassword, newuserName, uid);
        }
        return resultUser;
    },

    logIn: function (password, mail) {
        var resultUser = dbRowDefinition.userRecord('', '', '', '');
        var t = getUserByMail(mail);// importUserByName(userName);
        console.log('user status : ' + t);
        if ((t == null) || (t == undefined) || (t.id == '')) {
            return resultUser;
        }
        if (t.password != password) {
            return resultUser;
        }
        return t;

    },

    signIn: function (userName, password, mail) {
        var resultUser = dbRowDefinition.userRecord('', '', '', '');
        var t = getUserByName(userName);// importUserByName(userName);
        console.log('user status : ' + t);
        if ((t == null) || (t == undefined) || (t.id == '')) {
            console.log(' create id ');
            var uid = toolkit.createGuid();
            console.log('  id =  ' + uid);
            var qs = 'Insert into users values (\'' + uid + '\',\'' + mail + '\',\'' + password + '\',\'' + userName + '\');';
            console.log(qs);
            changeEntry(qs);
            resultUser = dbRowDefinition.userRecord(mail, password, userName, uid);
        }
        return resultUser;
    },

    signOut: function (userID) {
        // Delete entryies of user in all tables
        changeEntry('Delete from tweets where uid = \'' + uid + '\'');
        changeEntry('Delete from followers where vip = \'' + uid + '\' or uid = \'' + uid + '\'');
        changeEntry('Delete from admins where uid = \'' + uid + '\'');
        changeEntry('Delete from users where uid = \'' + uid + '\'');
    },

    evaluteFrequence: function (userID, firstDay, lastDay) {

    },

    importUserByName: function (userName) {
        return getUserByName(userName);
    },

    importUserByID: function (userID) {
        return getUserByID(userID);
    },

    importAvailableTweetsInPeriod: function (start, end) {
        getTweets('*', 'where timestamp >=\'' + start + '\' and timestamp <=\'' + end + '\'');
    },

    importAvailableTweets: function (filter, qback) {
        return getTweets(filter, qback);
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
        vipTweets = getTweets('*', qBack);
        return vipTweets;
    }


}
