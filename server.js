'use strict';

const express     = require('express');
const session     = require('express-session');
const bodyParser  = require('body-parser');
const fccTesting  = require('./freeCodeCamp/fcctesting.js');
const auth        = require('./app/auth.js');
const routes      = require('./app/routes.js');
const mongo       = require('mongodb').MongoClient;
const passport    = require('passport');
const cookieParser= require('cookie-parser')
const app         = express();
const http        = require('http').Server(app);
const sessionStore= new session.MemoryStore();
const io = require('socket.io')(http)
const passportSocketIo = require('passport.socketio')

fccTesting(app); //For FCC testing purposes

app.use('/public', express.static(process.cwd() + '/public'));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'pug')

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true,
  key: 'express.sid',
  store: sessionStore,
}));


mongo.connect(process.env.DATABASE, (err, db) => {
  if(err) console.log('Database error: ' + err);
  
  auth(app, db);
  routes(app, db);

  http.listen(process.env.PORT || 3000);
  
  io.use(passportSocketIo.authorize({
  cookieParser: cookieParser,
  key:          'express.sid',
  secret:       process.env.SESSION_SECRET,
  store:        sessionStore
  }));

  let currentUsers = 0
  //start socket.io code  
  // listen for connection event
  io.on('connection', socket => {
    console.log('user ' + socket.request.user.name + ' just connected')
    currentUsers++
    io.emit(
      'user',
      {
        name: socket.request.user.name,
        currentUsers,
        connected: true
      })
    
    // listen for disconnection event
    socket.on('disconnect', () => {
      currentUsers--
      io.emit(
      'user',
      {
        name: socket.request.user.name,
        currentUsers,
        connected: false
      })
    })
    
    // listen to chat messages
    socket.on('chat message', message => {
      // re broadcast message to all other clients
      io.emit('chat message', { message, 'name': socket.request.user.name })
    })
  })
});