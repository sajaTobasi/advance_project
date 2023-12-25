const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const mysql = require('mysql');
const datacollection = require('./datacollection');
const report = require('./report');
const educationalResourcesRouter = require('./educationalResourcesRouter');
const userprofile = require('./userprofile');
const enviromentalart = require('./enviromentalart');
const login = require('./login');
const signup = require('./signup');
const weather = require('./externalapi');

const app = express();
const port = process.env.PORT || 5000;

// MySQL configuration
const pool = mysql.createPool({
  connectionLimit: 10,
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'advance'
});

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Use express-session middleware
app.use(
  session({
    secret: '1234567',
    resave: false,
    saveUninitialized: true
  })
);

// Middleware to simulate user authentication
const authenticateUser = (req, res, next) => {
  // Assuming you have some way to determine if a user is logged in
  if (req.session && req.session.isAuthenticated) {
    return next();
  } else {
    res.redirect('/login');
  }
};




app.use('/report',authenticateUser, report(pool));
app.use('/resource', authenticateUser, educationalResourcesRouter(pool));
app.use('/user', authenticateUser, userprofile(pool));
app.use('/alart', authenticateUser, enviromentalart(pool));
app.use('/data', datacollection(pool));
app.use('/login', login(pool));
app.use('/signup', signup(pool));
app.use('/ext', weather(pool));


app.use('*', (req, res) => res.send({ message: 'Invalid endpoint.' }));

app.listen(port, () => console.log(`Listening on port ${port}`));
