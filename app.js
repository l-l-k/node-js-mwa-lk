var http = require('http')
var pg = require('pg');
var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var dbOperator = require("./dbOperations.js");
var app = express();
var admins = [];

app.set('port', (process.env.PORT || 5000));

app.listen(process.env.PORT, function () {
  console.log('Listening on port ' + process.env.PORT + ' !')
});

app.use(express.static('.'));
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

//Respond to GET request on the root route (/), the application’s home page:
app.get('/', function (request, response) {
  // response.send('Hello Ne87ööw World!');
  console.log('Get homepage...');
  response.sendFile(path.join(__dirname + '/UI.html'));
});

app.get('/db/readRecords', function (req, res) {
  console.log('Get ReadRecord Request...');
  console.log("param = " + req.params.length);
  console.log("query = " + req.query.length);
  // dbOperations.getRecords(req, res);
});

app.get('/db/addRecord', function (req, res) {
  console.log('Get AddRecord Request...');
  console.log("param = " + req.params.length);
  console.log("query = " + req.query.length);
  // dbOperations.addRecord(req, res);
});

app.get('/db/delRecord', function (req, res) {
  console.log('Get DeleteRecord Request...');
  console.log("param = " + req.params.length);
  console.log("query = " + req.query.length);
  // dbOperations.delRecord(req, res);
});

//___________________________________________________
// Default express methods
//Respond to POST request on the root route (/), the application’s home page:

app.post('/', function (req, res) {
  console.log('Got a POST request...');
  res.send('Got a POST request')
});

app.post('/Submit/signup', function (req, res) {
  console.log('Got a POST request to signup...');
  console.log("param = " + req.params.length);
  console.log("query = " + req.query.length);
  var params = [req.body.mailAddress,
  req.body.username, req.body.password];
  console.log('Got a POST request with these parameters : ' + params.join(' '));

  var newUser = dbOperator.signIn(req.body.username, req.body.password, req.body.mailAddress);
  res.set(newUser);
  res.send();
  //res.send('Got a POST request')
});

app.post('/Submit/login', function (req, res) {
  console.log('Got a POST request to login...');
  console.log("param = " + req.params.length);
  console.log("query = " + req.query.length);
  
  var params = [req.body.mailAddress, req.body.password];
  console.log('Got a POST request with these parameters : ' + params.join(' '));

  var validUser = dbOperator.logIn(req.body.password, req.body.mailAddress);
   console.log('Result : ' + validUser);
 res.set(validUser);
  res.send();
});

app.post('/Submit/account', function (req, res) {
  console.log('Got a POST request to update account data...');
  console.log("param = " + req.params.length);
  console.log("query = " + req.query.length);

  var params = [req.body.id, req.body.mailAddress,
  req.body.username, req.body.password];
  console.log('Got a POST request with these parameters : ' + params.join(' '));

  var result = dbOperator.updateAccount(req.body.id, req.body.mailAddress,  req.body.username, req.body.password);
  res.set(result);
  res.send();
});

app.post('/Submit/addTweet', function (req, res) {
  console.log('Got a POST request to add a new tweet...');
  console.log("param = " + req.params.length);
  console.log("query = " + req.query.length);

  var params = [req.body.id,
  req.body.message, (req.body.preview.length > 0)];
  console.log('Got a POST request with these parameters : ' + params.join(' '));
  console.log('Got a POST request with these parameters : ' + req.body.join(' '));

  var newtwet = dbOperator.sendTweet(req.body.id, req.body.message, req.body.preview);
  res.set(newTweet);
  res.send();
});

app.post('/Submit/displayTweets', function (req, res) {
  console.log('Got a POST request to get specific tweets...');
  console.log("param = " + req.params.length);
  console.log("query = " + req.query.length);

  var params = [req.body.id, req.body.start, req.body.end,
  req.body.message, (req.body.image.length > 0)];
  console.log('Got a POST request with these parameters : ' + params.join(' '));
  var tweets = dbOperator.getTweets(req.body.id, req.body.message, req.body.preview);
  res.set(tweets);
  res.send();
});

app.post('/Admin/addUser', function (req, res) {
  console.log('Got a POST request to add a new user...');
  console.log("param = " + req.params.length);
  console.log("query = " + req.query.length);

  var params = [req.body.mailAddress,
  req.body.username, req.body.password];
  console.log('Got a POST request with these parameters : ' + params.join(' '));

  var newUser = dbOperator.signIn(req.body.username, req.body.password, req.body.mailAddress);
  res.set(newUser);
  res.send();
});

app.post('/Admin/removeUser', function (req, res) {
  console.log('Got a POST request to remove an existing user...');
  console.log("param = " + req.params.length);
  console.log("query = " + req.query.length);

  var params = [req.body.userID];
  console.log('Got a POST request with these parameters : ' + params.join(' '));

  var result = dbOperator.signOut(req.body.userID);
  res.set(result);
  res.send();
});

app.post('/Admin/statistics', function (req, res) {
  console.log('Got a POST request to delete tweets...');
  console.log("param = " + req.params.length);
  console.log("query = " + req.query.length);

  var params = [req.body.userid, req.body.r11,  req.body.r12];
  console.log('Got a POST request with these parameters : ' + params.join(' '));
  console.log('Got a POST request with these parameters : ' + req.body.join(' '));

  var newUser = dbOperator.evaluteFrequence(req.body.userID,req.body.r11,  req.body.r12);
  res.set(newUser);
  res.send();
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
