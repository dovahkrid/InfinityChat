var express = require('express'),
    app = express(),
    path = require('path'),
    cookieParser = require('cookie-parser'),
    session = require('express-session'),
    config = require('./config/config.js'),
    ConnectMongo = require('connect-mongo')(session),
    mongoose = require('mongoose').connect(config.dbURL),
    passport = require('passport'),
    FacebookStrategy = require('passport-facebook').Strategy,
    rooms = []

app.set('views', path.join(__dirname, 'views'));
app.engine('html', require('hogan-express'));
app.set('view engine', 'html');
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());
var env = process.env.NODE_ENV || 'development';
if(env === 'development'){
  app.use(session({secret:config.sessionSecret, saveUninitialized:true, resave:true}));
}
else {
  app.use(session({
    secret:config.sessionSecret,
    store: new ConnectMongo({
      // url:config.dbURL,
      mongooseConnection:mongoose.connections[0],
      stringify:true
  }), saveUninitialized:true, resave:true}));
}
//
// var userSchema = mongoose.Schema({
//   username:String,
//   password:String,
//   fullname:String
// })
//
// var Person = mongoose.model('users', userSchema);
//
// var John = new Person({
//   username:'clgt',
//   password:'clgt',
//   fullname:'CLGT'
// })
//
// John.save(function(err){
//   console.log('Done !');
// })
// app.use(session({secret:'wtf', saveUninitialized:true, resave:true}));

// app.route('/').get(function(req, res, next){
//   // res.send('<h1> Hello World! </h1>');
//   res.render('index', {title:'ĐM, ChatWTF'});
// })

app.use(passport.initialize());
app.use(passport.session());

require('./auth/passportAuth.js')(passport, FacebookStrategy, config, mongoose);

require('./routes/routes.js')(express, app, passport, config, rooms);

// app.listen(3000, function(){
//   console.log('InfinityChat Working on Port 3000');
//   console.log('Mode: ' +env);
// })

app.set('port', process.env.PORT || 3000);
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
require('./socket/socket.js')(io, rooms);
server.listen(app.get('port'), function(){
  console.log('InfinityChat on Port: ' + app.get('port'));
  console.log('Mode: ' +env);
})
