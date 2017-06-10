var Hapi = require('hapi');
var Nes = require('nes');
const corsHeaders = require('hapi-cors-headers');

// create new server instance
var server = new Hapi.Server();

// add server’s connection information
server.connection({
    host: 'localhost',
    port: 3000
});
server.ext('onPreResponse', corsHeaders);
// server.route(require('./routes'));
// server.route(require('./routesapi'));

var pg = require("pg");
var conString = "postgres://asqxhbjfrvowud:a77c4272ba2680644502a2038c337c0fa97630f526a9a41592ec5620c0984697@ec2-54-221-217-158.compute-1.amazonaws.com:5432/d9qfa07k8iog8e";
var response;
var conStringRemote = "postgres://asqxhbjfrvowud:a77c4272ba2680644502a2038c337c0fa97630f526a9a41592ec5620c0984697@ec2-54-221-217-158.compute-1.amazonaws.com:5432/d9qfa07k8iog8e";
var conStringLocal = "pg://Karlheinz:k@localhost:5432/mwa2";
// DATABASE_URL in .env

server.register(Nes, function (err) {
    if (err) {
        throw err;
    }

    server.route({
        method: 'GET',
        path: '/h',
        config: {
            id: 'hello',
            handler: function (request, reply) {
                return reply('world!');
            }
        }

    });

});

server.register(require('inert'), function (err) {
    if (err) {
        throw err;
    }


    server.route({
        method: 'POST',
        path: '/setupdb',
        handler: function (request, reply) {
            var client = new pg.Client(conString);
            client.connect();
            var query = client.query("create table admins (uid text)");
            var query = client.query("create table users (uid text, mail text, password text, name text)");
            var query = client.query("create table followers (uid text, vip text, active boolean)");
            var query = client.query("create table tweets (uid text,timestamp timestamp without time zone, message text, image text )");
            reply("");
            client.end();
        }
    });


    //__________________ LEO START ____________
    //_________________________________________
    //_______________USEER Stuff_______________
    //get user by mail
    server.route({
        method: 'GET',
        path: '/UserGetByMail/{email}',
        handler: function (request, reply) {
            var result;
            var user;
            var client = new pg.Client(conString);
            client.connect();
            var qs = "SELECT * FROM users WHERE mail='" + request.params.email + "'";

            client.query(qs).then(res => reply(JSON.stringify(res.rows)))
                .then(() => client.end());
        }
    });
    //get user by id    
    server.route({
        method: 'GET',
        path: '/UserGetByUid/{id}',
        handler: function (request, reply) {
            var result;
            var client = new pg.Client(conString);
            client.connect();
            var query = client.query("SELECT * FROM users WHERE uid='" + request.params.id + "'").then(res => reply(JSON.stringify(res.rows)))
                .then(() => client.end());
        }
    });
    //get user by name    
    server.route({
        method: 'GET',
        path: '/UserGetByName/{name}',
        handler: function (request, reply) {
            var result;
            var client = new pg.Client(conString);
            client.connect();
            client.query("SELECT * FROM users WHERE name='" + request.params.name + "'").then(res => reply(JSON.stringify(res.rows)))
                .then(() => client.end());
        }
    });

    // check if email already exists
    server.route({
        method: 'GET',
        path: '/MailNameCheck/{nameemail*2}',
        handler: function (request, reply) {
            const Parts = request.params.nameemail.split('/');

            var result;
            var client = new pg.Client(conString);
            client.connect();
            client.query("SELECT * FROM users WHERE mail='" + Parts[0] + "' OR name ='" + Parts[1] + "'").then(res => reply(JSON.stringify(res.rows)))
                .then(() => client.end());
        }
    });
    // check if email already exists
    server.route({
        method: 'GET',
        path: '/MailCheck/{email}',
        handler: function (request, reply) {
            var result;
            var client = new pg.Client(conString);
            client.connect();
            client.query("SELECT * FROM users WHERE mail='" + request.params.email + "'").then(res => reply(JSON.stringify(res.rowCount == 0)))
                .then(() => client.end());
        }
    });
    // check if username already exists
    server.route({
        method: 'GET',
        path: '/NameCheck/{name}',
        handler: function (request, reply) {
            var result;
            var client = new pg.Client(conString);
            client.connect();
            client.query("SELECT * FROM users WHERE name=" + request.params.name).then(res => reply(JSON.stringify((res.rowCount == 0))))
                .then(() => client.end());
        }
    });

    // check if user is admin
    server.route({
        method: 'GET',
        path: '/AdminCheck/{id}',
        handler: function (request, reply) {
            var result;
            var client = new pg.Client(conString);
            client.connect();
            client.query("SELECT * FROM admins WHERE uid='" + request.params.id + "'")
                .then(res => reply(JSON.stringify((res.rowCount == 1))))
                .then(() => client.end());
        }
    });
    // create an account 
    server.route({
        method: 'POST',
        path: '/Signup/{idmailnamepassword*4}',
        handler: function (request, reply) {
            const userParts = request.params.idmailnamepassword.split('/');

            pg.connect(conString, function onConnect(err, client, done) {
                //Err - This means something went wrong connecting to the database.               
                var qs = "INSERT into users (uid,mail, name, password) VALUES($1, $2, $3, $4)";// + userParts[0] + "', '" + userParts[1] + "','" + userParts[2] + "', '" + userParts[3] + "')";
                try {
                    client.query(qs, userParts);
                    done();
                    reply("true");
                } catch (error) {
                    reply("false");
                }
            });


        }
    });
    // checking credentials
    server.route({
        method: 'POST',
        path: '/Login/{mailpassword*2}',
        handler: function (request, reply) {
            const userParts = request.params.mailpassword.split('/');
            var result;
            var client = new pg.Client(conString);
            client.connect();
            var qs = "SELECT * FROM users WHERE mail ='" + userParts[0] + "' AND password ='" + userParts[1] + "'";
            console.log(qs);
            client.query(qs).then(res => reply(JSON.stringify(res.rows)))
                .then(() => client.end());
        }
    });
    // edit Account    
    server.route({
        method: 'POST',
        path: '/AccountEdit/{idmailnamepassword*4}',
        handler: function (request, reply) {
            const userParts = request.params.idmailnamepassword.split('/');
            pg.connect(conString, function onConnect(err, client, done) {
                //Err - This means something went wrong connecting to the database.               
                var qs = "UPDATE users SET mail='" + userParts[1] + "', name='" + userParts[2] + "', password='" + userParts[3] + "' WHERE uid='" + userParts[0] + "'";

                try {
                    client.query(qs);
                    done();
                    reply();
                } catch (error) {
                    reply();
                }
            });
        }

    });
    // delete Account    
    server.route({
        method: 'POST',
        path: '/AccountRemove/{id}',
        handler: function (request, reply) {
            var result;
            var client = new pg.Client(conString);
            client.connect();
            try {
                var remove_users = client.query("DELETE from users WHERE uid=" + request.params.id);
                var remove_admins = client.query("DELETE from admins WHERE uid=" + request.params.id);
                var remove_followers = client.query("DELETE from followers WHERE uid=" + request.params.id + " OR vip =" + request.params.id);
                var remove_tweets = client.query("DELETE from tweets WHERE uid=" + request.params.id);
                reply("true");
            } catch (error) {
                reply("false");
            }
            client.end();
        }
    });
    //add Administrator
    server.route({
        method: 'POST',
        path: '/AdminAdd/{id}',
        handler: function (request, reply) {


            pg.connect(conString, function onConnect(err, client, done) {
                //Err - This means something went wrong connecting to the database.               
                var qs = "INSERT into admins (uid) VALUES(" + request.params.id + ")";
                try {
                    client.query(qs);
                    done();
                    reply("true");
                } catch (error) {
                    reply("false");
                }
            });
        }
    });
    //delete Administrator
    server.route({
        method: 'POST',
        path: '/AdminRemove/{id}',
        handler: function (request, reply) {
            var result;
            var client = new pg.Client(conString);
            client.connect();
            try {
                var insert = client.query("DELETE FROM admins WHERE uid =" + request.params.id + ")");
                reply("true");
            } catch (error) {
                reply("false");
            }
            client.end();
        }
    });
    //_________TWEETS____________   
    //addTweet
    server.route({
        method: 'POST',
        path: '/TweetAdd/{UidMessage*2}/{Picture?}',
        handler: function (request, reply) {
            const tweetParts = request.params.UidMessage.split('/');
            const Picture = request.params.Picture ? encodeURIComponent(request.params.Picture) : 'false';


            pg.connect(conString, function onConnect(err, client, done) {
                //Err - This means something went wrong connecting to the database.
                var qs;
                if (Picture == "false") {
                    qs = "INSERT into tweets (uid,timestamp,message) VALUES($1, now(), $2)";
                } else {
                    qs = "INSERT into tweets (uid,timestamp,message,image) VALUES($1, now(), $2, '" + Picture + "')";
                }
                try {
                    client.query(qs, tweetParts);
                    done();
                    reply("true");
                } catch (error) {
                    reply("false");
                }
            });
        }
    });
    //removeTweet
    server.route({
        method: 'POST',
        path: '/TweetRemove/{idTime*2}',
        handler: function (request, reply, done) {
            const tweetIdentifier = request.params.idTime.split('/');
            var result;
            var client = new pg.Client(conString);
            client.connect();
            var qs = "DELETE FROM tweets WHERE uid =" + tweetIdentifier[0] + " AND timestamp =" + tweetIdentifier[1] + ")";
            try {
                var insert = client.query(qs, tweetIdentifier);
                console.log(insert);
                done();
                reply("true");
            } catch (error) {
                reply("false");
            }
            client.end();
        }
    });

    //getTweets
    server.route({
        method: 'GET',
        path: '/TweetGetVIP/{uid}',//startEnd*3}',
        handler: function (request, reply) {
            const queryParts = request.params.uid;//.split('/');
            var result=[];
            var result_vip=[];
            var client = new pg.Client(conString);
            client.connect();
            var qs = '';
            // getting all active vips
            qs = "SELECT vip FROM followers WHERE uid ='" + queryParts/*[0]*/ + "' AND active = 'true'";
            console.log(qs);

            var query_vip = client.query(qs)
                .then(res => {
                    res.rows.forEach(function (element) {
                        console.log(element);
                        console.log(element.vip);
                        result_vip.push(element.vip);
                    }, this);
                    console.log(res);
                })
                .then(() => client.end())
            
                    console.log("resultvip: "+result_vip);
                    // getting all tweets of the vips in between the given timespan          
                    result_vip.forEach(function (element) {
                        qs = "SELECT * FROM tweets WHERE uid ='" + element + "'";//+ " AND timestamp > " + queryParts[1] + " AND timepstampe < " + queryParts[2] + ")";
                        console.log(qs);
                        var query_tweets = client.query(qs)
                            .then(res => {
                                console.log(res);
                                res.rows.forEach(function (element) {   
                                    console.log(element);
                                    result.push(element);
                                }, this);
                               
                            })
                            .then(() => client.end());
                    }, this);
                    console.log(result);
                    reply(JSON.stringify(result));
               
        }
    });

    //getTweets
    server.route({
        method: 'GET',
        path: '/TweetGet/{uid}',
        handler: function (request, reply) {
            var qs = "SELECT * FROM tweets WHERE uid='" + request.params.uid + "'";
            console.log("Query: " + qs);
            var client = new pg.Client(conString);
            client.connect();
            // getting all tweets
            client.query(qs)
                .then(res => reply(JSON.stringify(res.rows)))
                .then(() => client.end());
        }
    });
    

    //__________FOLLOWERS_____________
    // get all related followers 
    server.route({
        method: 'GET',
        path: '/FollowerGetAR/{uid}',
        handler: function (request, reply) {
            var result;
            var client = new pg.Client(conString);
            client.connect();
            client.query("SELECT * FROM followers WHERE uid='" + request.params.uid + "'")
                .then(res => reply(JSON.stringify(res.rows)))
                .then(() => client.end());
        }
    });



    // check if follower already exists
    server.route({
        method: 'GET',
        path: '/FollowerCheck/{uidvip*2}',
        handler: function (request, reply) {
            const queryParts = request.params.uidvip.split('/');
            var result;
            var client = new pg.Client(conString);
            client.connect();
            var query = client.query("SELECT * FROM followers WHERE uid=" + queryParts[0] + " AND vip =" + queryParts[1] + ")")
                .then(res => reply(JSON.stringify((res.rowCount == 0))))
                .then(() => client.end());
        }
    });
    // add follower
    server.route({
        method: 'GET',
        path: '/FollowerAdd/{uidvip*2}',
        handler: function (request, reply) {
            const queryParts = request.params.uidvip.split('/');
            var result;


            pg.connect(conString, function onConnect(err, client, done) {
                //Err - This means something went wrong connecting to the database.               
                var qs = "INSERT into followers (uid,vip) VALUES(" + queryParts[0] + "," + queryParts[1] + ")";
                try {
                    client.query(qs);
                    done();
                    reply("true");
                } catch (error) {
                    reply("false");
                }
            });
        }
    });
    // remove follower    
    server.route({
        method: 'GET',
        path: '/FollowerRemove/{uidvip*2}',
        handler: function (request, reply) {
            const queryParts = request.params.uidvip.split('/');
            var result;
            var client = new pg.Client(conString);
            client.connect();
            try {
                var insert = client.query("DELETE FROM followers WHERE uid =" + queryParts[0] + " AND vip=" + queryParts[1] + ")");
                reply("true");
            } catch (error) {
                reply("false");
            }
            client.end();
        }
    });
    // change status
    server.route({
        method: 'GET',
        path: '/FollowerActivate/{uidvipbool*2}',
        handler: function (request, reply) {
            const queryParts = request.params.uidvipbool.split('/');
            var result;
            var client = new pg.Client(conString);
            client.connect();
            try {
                var insert = client.query("UPDATE followers SET active =" + queryParts[2] + " WHERE uid =" + queryParts[0] + " AND vip=" + queryParts[1] + ")");
                reply("true");
            } catch (error) {
                reply("false");
            }
            client.end();
        }
    });
    //_________________________________________
    //___________________LEO ENDE _____________



    // add “hello world” route
    server.route({
        method: 'GET',
        path: '/',
        handler: function (request, reply) {
            //reply('Hello from Teugn')
            reply.file('ui.html'); //, {name: currentUser});
        }
    });

    // access local postgres DB
    server.route({
        method: 'GET',
        path: '/db',
        handler: function (request, reply) {
            console.log(conString);
            var result;
            var client = new pg.Client(conString);
            client.connect();
            var query = client.query("SELECT 1 + 1 as TBL");
            // var query = client.query("SELECT * FROM t1 ORDER BY id");
            query.on("row", function (row, result) {
                result.addRow(row);
            });
            query.on("end", function (result) {
                response = JSON.stringify(result.rows, null, "    ");
                console.log(response);
                //  console.log(JSON.stringify(result.rows, null, "    "));
                client.end();
            });
            reply("X: " + response);
        }
    });

    // display a picture
    server.route({
        method: 'GET',
        path: '/picture',
        handler: function (request, reply) {
            reply.file('bird.png')
        }
    });

    // open a html file
    server.route({
        method: 'GET',
        path: '/ui/{userName}',
        handler: function (request, reply) {
            var currentUser = encodeURIComponent(request.params.userName);
            reply.file('subdir/ui.html'); //, {name: currentUser});
        }
    });

    // process parameter
    server.route({
        method: 'GET',
        path: '/users/{userName}',
        handler: function (request, reply) {
            reply('Hello from Teugn, ' + encodeURIComponent(request.params.userName) + ' !');
        }
    });

    server.route({
        method: 'GET',
        path: '/test',
        handler: function (request, reply) {
            reply('Hello from Teugn!');
        }
    });

});

// start your server
server.start(function (err) {
    if (err) {
        throw err
    }

    console.log('Server running at: ', server.info.uri)
});
