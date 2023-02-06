require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const session = require("express-session");
const path = require('path');
const multer  = require('multer');
const expressLayouts = require('express-ejs-layouts');
const userRoutes = require('./routes/user');
const voterRoutes = require('./routes/voter');
const User = require('./controllers/userController');

// express app
const app = express();
app.set('view engine', 'ejs');

// middleware

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.static('public'));
app.use((req, res, next) => {
  console.log(req.path, req.method)
  next()
});


app.use(session({secret: process.env.SECRET,saveUninitialized: true,resave: true}));
 
// making the session data available globally to all the routes and views
app.use(function(req, res, next) {
  res.locals.user = req.session.user;
  next();
});
// Default Layout

app.use(expressLayouts);
app.set('layout',  './admin/index');




app.use('/',  userRoutes);
app.use('/voter', voterRoutes);
 



// routes
/*
app.use('/election', electionRoutes);
app.use('/position', positionRoutes);
app.use('/candidates', candidateRoutes);

*/

// connect to db
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    // listen for requests
    app.listen(process.env.PORT, () => {
      console.log('connected to db & listening on port', process.env.PORT)
    })
  })
  .catch((error) => {
    console.log(error)
  });