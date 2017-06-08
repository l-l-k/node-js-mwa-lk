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
var conString = "pg://Karlheinz:k@localhost:5432/mwa2";
var response;
var conStringRemote = "postgres://asqxhbjfrvowud:a77c4272ba2680644502a2038c337c0fa97630f526a9a41592ec5620c0984697@ec2-54-221-217-158.compute-1.amazonaws.com:5432/d9qfa07k8iog8e";
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
            var query = client.query("SELECT * FROM users WHERE mail=" + request.params.email);
            query.on("row", function (row, result) {               
                result.addRow(row);
            });

            if (result.rows == null) {
                reply("false");
            } else {
                reply(JSON.stringify(result));
            }
            client.end();
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
            var query = client.query("SELECT * FROM users WHERE uid=" + request.params.id);
            query.on("row", function (row, result) {
                result.addRow(row);
            });

            if (result.rows == null) {
                reply("false");
            } else {
                reply(JSON.stringify(result));
            }
            client.end();
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
            var query = client.query("SELECT * FROM users WHERE name=" + request.params.name);
            query.on("row", function (row, result) {
                result.addRow(row);
            });

            if (result.rows == null) {
                reply("false");
            } else {
                reply(JSON.stringify(result));
            }
            client.end();
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
            var query = client.query("SELECT * FROM users WHERE mail=" + request.params.email);
            query.on("row", function (row, result) {
                result.addRow(row);
            });
            
            if (result.rows == null) {
                reply("true");
            } else {
                reply("false");
            }   
            client.end();
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
            var query = client.query("SELECT * FROM users WHERE name=" + request.params.name);
            query.on("row", function (row, result) {
                result.addRow(row);
            });

            if (result.rows == null) {
                reply("true");
            } else {
                reply("false");
            }
            client.end();
        }
    });    
    // create an account : TODO <<id>>
    server.route({
        method: 'POST',
        path: '/Signup/{mailnamepasswort*3}',
        handler: function (request, reply) {
            const userParts = request.params.mailnamepasswort.split('/');
            var result;
            var client = new pg.Client(conString);
            client.connect();
            try {
                var insert = client.query("INSERT into users (mail, name, passwort) VALUES(" + userParts[0] + ", " + userParts[1] + ", " + userParts[2] + ")");
                reply("true");
            } catch (error) {
                reply("false");
            }
            client.end();
        }
    });    
 // checking credentials
    server.route({
        method: 'GET',
        path: '/Login/{mailpasswort*2}',
        handler: function (request, reply) {
            const userParts = request.params.mailpasswort.split('/');
            var result;
            var client = new pg.Client(conString);
            client.connect();          
                var query = client.query("SELECT * FROM users WHERE mail ="+ userParts[0] + " AND passwort =" + userParts[1] + ")");
                query.on("row", function (row, result) {
                    result.addRow(row);
                });

                if (result.rows == null) {
                    reply("false");
                } else {
                    reply("true");
                }
                client.end();
        }
    });        
    // edit Account    
    server.route({
        method: 'POST',
        path: '/AccountEdit/{idmailnamepasswort*4}',
        handler: function (request, reply) {
            const userParts = request.params.idmailnamepasswort.split('/');
            var result;
            var client = new pg.Client(conString);
            client.connect();
            try {
                var update = client.query("UPDATE users SET mail=" + userParts[1] + ", name=" + userParts[2] + ", passwort=" + userParts[3] + " WHERE uid=" + userParts[0]);
                reply("true");
            } catch (error) {
                reply("false");
            }
            client.end();
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
            var result;
            var client = new pg.Client(conString);
            client.connect();
            try {
                var insert = client.query("INSERT into admins (uid) VALUES("+request.params.id+")");
                reply("true");
            } catch (error) {
                reply("false");
            }
            client.end();
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
        path: '/TweetAdd/{UidTimeMessage*3}/{Picture?}',
        handler: function (request, reply) {
            const tweetParts = request.params.UidTimeMessage.split('/');
            const Picture = request.params.Picture ? encodeURIComponent(request.params.Picture) : 'false';
            var result;
            var client = new pg.Client(conString);
            client.connect();
            try {
                if (Picture == "false") {
                    var insert = client.query("INSERT into tweets (uid,timestamp,message) VALUES(" + tweetParts[0] + "," + tweetParts[1] + "," + tweetParts[2] + ")");
                } else
                {
                    var insert = client.query("INSERT into tweets (uid,timestamp,message,image) VALUES(" + tweetParts[0] + "," + tweetParts[1] + "," + tweetParts[2] + "," + Picture+ ")");
                }    
                reply("true");
            } catch (error) {
                reply("false");
            }
            client.end();
        }
    });  
//removeTweet
    server.route({
        method: 'POST',
        path: '/TweetRemove/{idTime*2}',
        handler: function (request, reply) {
            const tweetIdentifier = request.params.idTime.split('/');
            var result;
            var client = new pg.Client(conString);
            client.connect();
            try {
                var insert = client.query("DELETE FROM tweets WHERE uid =" + tweetIdentifier[0] + " AND timestamp =" + tweetIdentifier[1]+")");
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
        path: '/TweetGet/{uidstartEnd*3}',
        handler: function (request, reply) {
            const queryParts = request.params.mailpasswort.split('/');
            var result;
            var result_vip;
            var client = new pg.Client(conString);
            client.connect();
            // getting all active vips
            var query_vip = client.query("SELECT vip FROM followers WHERE uid =" + queryParts[0] + " AND active = 'true')");
            query_vip.on("row", function (row, result) {
                result_vip.push(row[0]);
            });
            // getting all tweets of the vips in between the given timespan
            result_vip.forEach(function(element) {
                var query_tweets = client.query("SELECT * FROM tweets WHERE uid =" + element + " AND timestamp > " + queryParts[1] + " AND timepstampe < " + queryParts[2]+")");
                query_tweets.on("row", function (row, result) {
                    result.addRow(row);
                });
            }, this);

            if (result.rows == null) {
                reply("false");
            } else {
                reply(JSON.stringify(result));
            }
            client.end();
        }
    }); 
//__________FOLLOWERS_____________
    // check if follower already exists
    server.route({
        method: 'GET',
        path: '/FollowerCheck/{uidvip*2}',
        handler: function (request, reply) {
            const queryParts = request.params.uidvip.split('/');
            var result;
            var client = new pg.Client(conString);
            client.connect();
            var query = client.query("SELECT * FROM followers WHERE uid=" + queryParts[0] + " AND vip =" + queryParts[1]+")");
            query.on("row", function (row, result) {
                result.addRow(row);
            });

            if (result.rows == null) {
                reply("false");
            } else {
                reply("true");
            }
            client.end();
        }
    });    
// add follower
    server.route({
        method: 'GET',
        path: '/FollowerAdd/{uidvip*2}',
        handler: function (request, reply) {
            const queryParts = request.params.uidvip.split('/');
            var result;
            var client = new pg.Client(conString);
            client.connect();
            try {
                var insert = client.query("INSERT into followers (uid,vip) VALUES(" + queryParts[0] + "," + queryParts[1]+")");
                reply("true");
            } catch (error) {
                reply("false");
            }
            client.end();
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
                var insert = client.query("UPDATE followers SET active =" + queryParts[2] +" WHERE uid =" + queryParts[0] + " AND vip=" + queryParts[1] + ")");
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
