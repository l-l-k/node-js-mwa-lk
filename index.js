var http = require('http')
var pg = require('pg');
var express = require('express');
var app = express();

app.set('port', (process.env.PORT || 5000));

app.listen(process.env.PORT, function () {
  console.log('Listening on port ' + process.env.PORT + ' !')
})

app.use(express.static('.'));
//Respond to GET request on the root route (/), the application’s home page:
app.get('/', function (request, response) {
  response.send('Hello Ne87ööw World!');
  //response.render('UI');
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

  // app.get('/', function (request, response) {
  //   response.send('Connected to postgres! Getting schemas...');
    //response.render('UI');
  });
 

  // client
  //   .query('SELECT table_schema,table_name FROM information_schema.tables;')
  //   .on('row', function(row) {
  //     console.log(JSON.stringify(row));
  //   });

