var http = require('http')
var pg = require('pg');
var express = require('express');
var path = require('path');
var app = express();
// var xdbReader = dbReader();
// var xdbWriter = dbWriter();

app.set('port', (process.env.PORT || 5000));

app.listen(process.env.PORT, function () {
  console.log('Listening on port ' + process.env.PORT + ' !')
})

app.use(express.static('.'));

//Respond to GET request on the root route (/), the application’s home page:
app.get('/', function (request, response) {
  // response.send('Hello Ne87ööw World!');
  response.sendFile(path.join(__dirname + '/UI.html'));
});


//Respond to POST request on the root route (/), the application’s home page:
app.post('/', function (req, res) {
  res.send('Got a POST request')
})

//Respond to a PUT request to the /user route:
app.put('/user', function (req, res) {
  res.send('Got a PUT request at /user')
})

//Respond to a DELETE request to the /user route:
app.delete('/user', function (req, res) {
  res.send('Got a DELETE request at /user')
})

// return all rows in test_table

// app.get('/db', function (request, response) {
//   pg.connect(process.env.DATABASE_URL, function(err, client, done) {
//     client.query('SELECT * FROM test_table', function(err, result) {
//       done();
//       if (err)
//        { console.error(err); response.send("Error " + err); }
//       else
//        { response.render('pages/db', {results: result.rows} ); }
//     });
//   });
// });

// use a timer
// app.get('/times', function(request, response) {
//     var result = ''
//     var times = process.env.TIMES || 5
//     for (i=0; i < times; i++)
//       result += i + ' ';
//   response.send(result);
// });

// ___________________________________________
// Database initialisation

pg.defaults.ssl = true;
//pg.defaults.ssl = false;
pg.connect(process.env.DATABASE_URL, function (err, client) {
  if (err) throw err;
  console.log('Connected to postgres! Getting schemas...');

  client
    .query('SELECT * FROM admins')
    .on('row', function(row) {console.log(JSON.stringify(row))});

  // .on('row', function(row) {
  //   console.log(JSON.stringify(row));
  //.on('row', xdbReader.importAdmins(row));
});

function importAdmins(row) {
  admins.push(row[0]);
};

