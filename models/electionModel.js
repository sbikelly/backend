const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');
const validator = require('validator');

const eSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  name: {
    type: String ,
    required: true
  },
  status: String,
  created_on: String,
  updated_on: String
});


module.exports = mongoose.model('Electn', eSchema)

