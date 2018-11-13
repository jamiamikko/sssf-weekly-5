'use strict';

require('dotenv').config();
const https = require('https');
const http = require('http');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
const passport = require('passport');
const handlebars = require('express-handlebars');
const socket = require('socket.io');
const helmet = require('helmet');

require('./passport')(passport);

const fs = require('fs');
const mongoose = require('mongoose');

const index = require('./routes/index');
const images = require('./routes/images');
const auth = require('./routes/auth');

const express = require('express');
const app = express();

app.engine(
  'handlebars',
  handlebars({
    extname: 'handlebars',
    defaultLayout: 'layout',
    layoutsDir: __dirname + '/views/layouts/'
  })
);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'handlebars');

app.use(
  session({
    secret: process.env.SECRET,
    resave: true,
    saveUninitialized: true
  })
);

app.use(helmet());
app.use(passport.initialize());
app.use(passport.session());

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

const sslkey = fs.readFileSync('./config/ssl-key.pem');
const sslcert = fs.readFileSync('./config/ssl-cert.pem');

app.enable('trust proxy');

app.use((req, res, next) => {
  if (req.secure) {
    // request was via https, so do no special handling
    next();
  } else {
    // request was via http, so redirect to https
    res.redirect('https://' + req.headers.host + req.url);
  }
});

const server = app.listen(3000);

// const options = {
//   key: sslkey,
//   cert: sslcert
// };

// const server = https
//   .createServer(options, app)
//   .listen(process.env.PORT || 3000);

// http
//   .createServer((req, res) => {
//     res.writeHead(301, {
//       Location: 'https://sssf-weekly-all.paas.datacenter.fi'
//     });
//     res.end();
//   })
//   .listen(8080);

const io = socket(server);

io.on('connection', (socket) => {
  console.log('There is a connection', socket.id);

  socket.on('call', (message) => {
    socket.broadcast.emit('call', message);
  });

  socket.on('answer', (data) => {
    socket.broadcast.emit('answer', data);
  });

  socket.on('candidate', (message) => {
    console.log('candidate message recieved!');
    socket.broadcast.emit('candidate', message);
  });
});

mongoose
  .connect(
    `mongodb://${process.env.DB_USER}:${process.env.DB_PASS}@${
      process.env.DB_HOST
    }:${process.env.DB_PORT}/images`,
    {useNewUrlParser: true}
  )
  .then((db) => {})
  .catch((err) => {
    console.log(err);
  });

const db = mongoose.connection;

db.once('open', () => {
  console.log('Connected to MongoDB');
});

db.on('error', (err) => {
  console.log(err);
});

app.use('/', index);
app.use('/images', images);
app.use('/login', auth(passport));

app.use((err, req, res, next) => {
  console.log('ERROR');
  res.status(400).send({error: err.message});
});
