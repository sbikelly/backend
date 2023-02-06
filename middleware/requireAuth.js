const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const session = require("express-session");
const express = require('express');
const app = express();

app.use(session({secret: process.env.SECRET,saveUninitialized: true,resave: true}));

const requireAuth = async (req, res, next) => {
  // verify user is authenticated
  const { authorization } = req.headers
  console.log(req.headers.authorization);

  if (!authorization) {
    let  msg = ' Session Expired!!! '
    res.render('index', 
      {
        title: 'Sign In',
        msg: msg, 
        layout: 'index'
      }
    ); 
  
    //return res.status(401).json({error: 'Authorization token required'})
  }else{

  const token = authorization.split(' ')[1]

  try {
    const { _id } = jwt.verify(token, process.env.SECRET);

    req.user = await User.findOne({ _id }).select('_id');
    
    req.session.user = req.user;
    req.session.save();
    console.log('=====User Auth===== '+req.session.user);
    //console.log(req.user)
    next()

  } catch (error) {
    console.log(error)
    res.status(401).json({error: 'Request is not authorized'})
  }
}
}

module.exports = requireAuth