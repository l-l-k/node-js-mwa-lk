module.exports = {
    getRecords: function (req, res) {
        var pg = require('pg');

        //You can run command "heroku config" to see what is Database URL from Heroku belt

        pg.defaults.ssl = true;
        pg.connect(process.env.DATABASE_URL, function (err, client) {
            if (err) throw err;
            console.log('Connected to postgres! Getting records...');
            var query = client.query(req);
            query.on('row', function (row, result) {
                result.addRow(row);
            });

            query.on("end", function (result) {
                client.end();
                res.writeHead(200, { 'Content-Type': 'text/plain' });
                res.write(JSON.stringify(result.rows, null, "    ") + "\n");
                res.end();
            });
        });
    },


    addRecord: function (req, res) {
        var pg = require('pg');

        pg.connect(process.env.DATABASE_URL, function (err, client) {
            if (err) throw err;
            console.log('Connected to postgres! Getting records...');
            console.log(req.query);
            var query = client.query(req.query);

            query.on("end", function (result) {
                client.end();
                res.write('Success');
                res.end();
            });
        });
    },

    delRecord: function (req, res) {
        var pg = require('pg');

        pg.connect(process.env.DATABASE_URL, function (err, client) {
            if (err) throw err;
            console.log('Connected to postgres! Getting records...');
            console.log(req.query);
            var query = client.query(req.query);

            query.on("end", function (result) {
                client.end();
                res.write('Success');
                res.end();
            });
        });
    }

};