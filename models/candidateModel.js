const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');
const validator = require('validator');

const cSchema = new Schema({
  u_id: {
    type: String ,
    required: true
  },
  name: {
    type: String ,
    required: true
  },
  votesCount: {
    type: Number
  },
  dept: {
    type: String,
    required: true
  },
  dob:  String ,
  gender: {
    type: String ,
    required: true
  },
  manifesto: String ,
  email: String ,
  phone: String,
  photo: String,
  p_id: {
    type: String,
    required: true
  },
  e_id: {
    type: String,
    required: true
  }
});


module.exports = mongoose.model('Candt', cSchema)

