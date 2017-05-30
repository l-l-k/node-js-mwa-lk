var Hapi = require('hapi');
var Nes = require('nes');

// create new server instance
var server = new Hapi.Server();

// add server’s connection information
server.connection({
    host: 'localhost',
    port: 3000
});


var pg = require("pg");
var conString = "pg://Karlheinz:k@localhost:5432/mwa2";
var response;


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
