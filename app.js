var http = require('http')
var pg = require('pg');
var express = require('express');
var path = require('path');
var dbOperations = require("./dbOperations.js");
var dbReader = require("./js/dbReaderDB.js");
var dbWriter = require("./js/dbWriterDB.js");

var app = express();
var admins = [];

app.set('port', (process.env.PORT || 5000));

app.listen(process.env.PORT, function () {
  console.log('Listening on port ' + process.env.PORT + ' !')
});

app.use(express.static('.'));

//Respond to GET request on the root route (/), the application’s home page:
app.get('/', function (request, response) {
  // response.send('Hello Ne87ööw World!');
  console.log('Get homepage...');
  response.sendFile(path.join(__dirname + '/UI.html'));
});

app.get('/db/readRecords', function (req, res) {
  console.log('Get ReadRecord Request...');
  dbOperations.getRecords(req, res);
});

app.get('/db/addRecord', function (req, res) {
  dbOperations.addRecord(req, res);
});

app.get('/db/delRecord', function (req, res) {
  dbOperations.delRecord(req, res);
});

//___________________________________________________
// Default express methods
//Respond to POST request on the root route (/), the application’s home page:

app.post('/', function (req, res) {
  console.log('Got a POST request...');
  res.send('Got a POST request')
});

app.post('/signup', function (req, res) {
  console.log('Got a POST request to signup...');
  res.send('Got a POST request')
});

app.post('/Submit', function (req, res) {
  console.log('Got a POST request to signup...');
  res.send('Got a POST request')
});

//Respond to a PUT request to the /user route:
app.put('/user', function (req, res) {
  res.send('Got a PUT request at /user')
});

//Respond to a DELETE request to the /user route:
app.delete('/user', function (req, res) {
  res.send('Got a DELETE request at /user')
});

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
// //pg.defaults.ssl = false;
pg.connect(process.env.DATABASE_URL, function (err, client) {
  if (err) throw err;
  console.log('Connected to postgres! Getting schemas...');
});

