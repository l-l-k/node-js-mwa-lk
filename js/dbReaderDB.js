function readDB() {
    // Private properties
    var comparativeValue;
    var ls = new localStorageInitialisation();

    availableTweets = new Array();

    // =================================================== 
    // Private methods
    // users

    function equalsVIPID(vip) {
        return vip.id == comparativeValue;
    }

    function importUserByID(userID) {
        var user = userRecord;
        var rows = getRowsOfQuery('Select * from users where uid = ' + userID + ';');
        if ((rows == null) || (rows.length == 0)) {
            user = new userRecord();
        } else {
            var row = rows[0];
            var user = userRecord(row.mail, row.name, row.password, row.uid);
        }
        return user;
    }

    // tweets
    function equalsTweetAuthor(tweet) {
        return tweet.userID == comparativeValue;
    }

    function importAvailableTweetsInPeriod(start, end) {
        importAvailableTweets('*', 'where timestamp >=\'' + start + '\' and timestamp <=\'' + end + '\'');
    }

    function importAvailableTweets(filter, qback) {
        if (qback == null) {
            qback = ' limit 20';
        }
        var rows;
        var query;
        if (filter == '*') {
            query = 'Select * from tweets' + qback + ';';
        } else {
            query = 'Select * from tweets  where uid = ' + filter + ' limit 20;';
        }
        rows = getRowsOfQuery(query);
        var tweets = new Array();
        for (i = 0; i < rows.length; i++) {
            var tweet = tweetRecord(rows[i].uid, mwaToolset.getDay(rows[i].timestamp), mwaToolset.getTime(rows[i].timestamp), rows[i].message, rows[i].image);
            tweets.push(tweet);
        }
        return tweets;
    }

    function getVipTweets() {
        var vipTweets = new Array;
        var filter;
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
                    filter = filter.concat(vipResults, '\' or uid = \'');
                }
            }
        }
        vipTweets = importAvailableTweets(filter);
        return vipTweets;
    }

    function getRowsOfQuery(querystring) {
        pg.defaults.ssl = true;
        pg.connect(process.env.DATABASE_URL, function (err, client) {
            if (err) throw err;
            //console.log('Connected to postgres! Getting schemas...');
            var query = client.query(querystring);
            query.on('row', function (row, result) {
                result.addRow(row);
            });

            query.on("end", function (result) {
                client.end();
                return (result.rows);
            });
        });
    }



    // =================================================== 
    // Public methods
    var reader = {

        importAdmins: function () {
            var rows = getRowsOfQuery('Select * from admins;');
            for (i = 0; i < rows.length; i++) {
                admins.push(rows[i].uid.trim());
            }
        },

        importVips: function (userID) {
            var rows = getRowsOfQuery('Select * from followers where uid = ' + userID + ';');
            vips = [];
            for (i = 0; i < rows.length; i++) {
                var vip = vipRecord(rows[i].uid, rows[i].vip, rows[i].active);
                vips.push(vip);
            }
        },

        // Handling tweets
        retrieveVIPDataByID: function (userID) {
            comparativeValue = userID;
            var existingVip = vipRecord;
            var index = -1;
            if (vips != null) {
                index = vips.findIndex(equalsVIPID);
            }
            if (index >= 0) {
                existingVip = vips[index];
            }

            return existingVip;
        },

        retrieveUserDataByID: function (userID) {
            var existingUser = importUserByID(userID);
            return existingUser;
        },

        retrieveUserDataByName: function (username) {
            var user = userRecord;
            var rows = getRowsOfQuery('Select * from users where name = ' + username + ';');
            if ((rows == null) || (rows.length == 0)) {
                user = new userRecord();
            } else {
                var row = rows[0];
                var user = userRecord(row.mail, row.name, row.password, row.uid);
            }
            return user;
        },

        retrieveUserDataByMailAddress: function (mailAddress) {
            var user = userRecord;
            var rows = getRowsOfQuery('Select * from users where mail = ' + mailAddress + ';');
            if ((rows == null) || (rows.length == 0)) {
                user = new userRecord();
            } else {
                var row = rows[0];
                var user = userRecord(row.mail, row.name, row.password, row.uid);
            }
            return user;
        },

        findUserName: function findUserName(name) {
            var user = retrieveUserDataByName(name);
            return (user.mail!=null);
        },

        findMailAddress: function (address) {
            var user = retrieveUserDataByName(name);
            return (user.mail!=null);
        },

        determineUserStatus: function (userID) {
            comparativeValue = userID;
            var index = admins.findIndex(equalsUserID);
            var isAdmin = index >= 0;;

            return isAdmin;
        },


        // =================================================== 
        // Handling tweets

        restoreTweets: function () {
            currentTweet = JSON.parse(localStorage.getItem(ls.currentMessageKey));
            lastDisplayedMessages = JSON.parse(localStorage.getItem(ls.lastDisplayedMessagesKey));
        },

        getSubsetOfTweetsByID: function (filter) {
            var results = new Array; // of  tweetRecord objects
            if (filter != "none") {
                results = importAvailableTweets(filter);
            }
            //  append tweets of selected vips
            var vipTweets = getVipTweets();
            availableTweets = results.concat(vipTweets);
            return availableTweets;
        },

        // =================================================== 
        // Statistical queries

        getTweetsInPeriod: function (startDate, endDate) {
            var tweets = importAvailableTweetsInPeriod(startDate, endDate);
            var results = [];
            var tweet; // = tweetRecord;
            var datum = "";
            var day;

            for (var i = [0]; i < tweets.length; i++) {
                tweet = tweets[i];
                datum = tweet.day.split("-");
                day = new Date(datum[0], datum[1], datum[2]);
                if ((day >= startDate) && (day <= endDate)) {
                    results.push(tweet);
                }
            }

            return results;
        },

    };

    return reader;
}

