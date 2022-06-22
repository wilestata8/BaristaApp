
var express  = require('express');
var app      = express();
var port     = process.env.PORT || 2032;
const MongoClient = require('mongodb').MongoClient
var mongoose = require('mongoose');
var passport = require('passport');
var flash    = require('connect-flash');
const serverless = require("serverless-http");
const router = express.Router();
var morgan       = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
var session      = require('express-session');
var configDB = require('./config/database.js');
const database = require('../baristaApp-first/config/database.js');

var db

router.get("/", (req, res) => {
  res.json({
    hello: "hi!"
  });
});

app.use(`/.netlify/functions/api`, router);

module.exports = app;
module.exports.handler = serverless(app);

// configuration ===============================================================
mongoose.connect(configDB.url,{useNewUrlParser: true, useUnifiedTopology:true}, (err, database) => {
  if (err) return console.log(err)
    const client = new MongoClient(configDB.url,{useNewUrlParser: true, useUnifiedTopology:true});
    client.connect((err) => {
      console.log(`Connected to ${configDB.dbName} Database`)
      db = client.db(configDB.dbName)
  // if (err) return console.log(err)
  // // console.log(database)
  // db = database
  // console.log(db)
  require('./app/routes.js')(app, passport, db);
    })
}); // connect to our database


require('./config/passport')(passport);

app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser.json()); // get information from html forms
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'))

app.set('view engine', 'ejs'); // set up ejs for templating

// required for passport
app.use(session({
    secret: 'rcbootcamp2022a', // session secret
    resave: true,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session


// routes ======================================================================
//require('./app/routes.js')(app, passport, db); // load our routes and pass in our app and fully configured passport

// launch ======================================================================
app.listen(port);
console.log('The magic happens on port ' + port);


