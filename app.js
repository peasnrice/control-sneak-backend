/*global console*/
/*jslint node:true*/ 
var express = require('express');
var mongoose = require('mongoose');
var passport = require('passport');
var findOrCreate = require('mongoose-findorcreate');
var FacebookTokenStrategy = require('passport-facebook-token').Strategy;
var qs = require('querystring');

var app = express();

//provider: 'facebook',
//  id: '10153494206687533',
//  displayName: 'Andy Evans',
//  name: { familyName: '', givenName: '', middleName: '' },
//  gender: '',
//  emails: [ { value: '' } ],
//  photos: [ { value: 'https://graph.facebook.com/10153494206687533/picture?type=large' } ],
//  _raw: '{"name":"Andy Evans","id":"10153494206687533"}',
//  _json: { name: 'Andy Evans', id: '10153494206687533' } }


var FACEBOOK_APP_ID = "1678602979038851";
var FACEBOOK_APP_SECRET = "a4a9e8bf1e5b2e90928aeffec02cf3a5";
 
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});

//Setup Facebook Authentication by Token
passport.use(new FacebookTokenStrategy({
    clientID: "1678602979038851",
    clientSecret: "a4a9e8bf1e5b2e90928aeffec02cf3a5",
  },
  function(accessToken, refreshToken, profile, done) {
	console.log(profile);
    User.findOrCreate({ 
		provider  :  profile.provider,
  		id   :  profile.id,
		displayName  :  profile.displayName,
		familyName  :  profile.familyName,
		givenName  :  profile.givenName
	}, function (err, user) {
		return done(err, user);
    });
  }
));

var UserSchema = new mongoose.Schema({
    provider  :  String,
  	id   :  String,
	displayName  :  String,
	familyName  :  String,
	givenName  :  String
});

UserSchema.plugin(findOrCreate);
var User = mongoose.model('User', UserSchema);

//define routes - this needs to be broken out into a routes directory
app.get('/', function(req, res){
    res.send('Hello World!');
});


//define routes - this needs to be broken out into a routes directory
//app.post('/login/facebook', function(req, res){	
//    var body = '';
//    req.on('data', function (data) {
//        body += data;
//        // Too much POST data, kill the connection!
//        if (body.length > 1e6)
//            req.connection.destroy();
//    });
//    req.on('end', function () {
//        var post = JSON.parse(body);
//		var access_token = post.access_token;
//		console.log(access_token);
//		var req_2 = body;
//		
//		passport.authenticate('facebook-token'), function (req_2, res) {
//			console.log("hm");
//			res.send(req_2.user? 200 : 401);
//		}
//		console.log("gr");
//    });
//});

app.post('/login/facebook', 
		 passport.authenticate('facebook-token'), 
		 function (req, res) {
			console.log(req);
			console.log(res);
			if (req.user){
				//you're authenticated! return sensitive secret information here.
				console.log("you're authenticated!");
				console.log(req.user);
				console.log(req.session);
				res.sendStatus(200);
			} else {
				// not authenticated. go away.
				console.log("not authenticated. go away.");
				res.sendStatus(401);
			}
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