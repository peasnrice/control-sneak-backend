/*global console*/
/*jslint node:true*/ 
var express = require('express');
var mongoose = require('mongoose');
var passport = require('passport');

var app = express();

//define routes - this needs to be broken out into a routes directory
app.get('/', function(req, res){
    res.send('Hello World!');
});

app.get('/hello', function(req, res){
    res.send('this is a test');
});

var server = app.listen(3000, function(){
    var host = server.address().address;
    var port = server.address().port;

    console.log('Example app listening at http://%s:%s', host, port);
});

//initialise mongodb connection with mongoose
mongoose.connect('mongodb://localhost');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function (callback) {
  // yay!
});

//route for social authentication with passport.js
app.post('/login',
  passport.authenticate('facebook'),
  function(req, res) {
    // If this function gets called, authentication was successful.
    // `req.user` contains the authenticated user.
    res.redirect('/users/' + req.user.username);
});