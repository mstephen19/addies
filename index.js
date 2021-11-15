const express = require('express');
const path = require('path');
const session = require('express-session');
const mongoose = require('mongoose');
const log = require('morgan');

const MongoDBStore = require('connect-mongodb-session')(session);

const routes = require('./controllers');

const app = express();
const PORT = process.env.PORT || 3001;

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/addies', {
  // useNewUrlParser: true,
  // useFindAndModify: false,
});

mongoose.connection.once('open', () => {
  console.log('Successfully connected to DB');
});

const store = new MongoDBStore({
  uri: process.env.MONGODB_URI || 'mongodb://localhost/addies',
  collection: 'mySessions',
});

store.on('error', (err) => {
  console.log(err);
});

const sess = {
  secret: 'superSecretSecret',
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 7,
    secret: 'superSuperSecret',
  },
  resave: false,
  saveUninitialized: true,
  store: store,
};

app.use(log('dev'));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(session(sess));

app.use('/', routes);

app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
});
