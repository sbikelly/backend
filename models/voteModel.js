const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');
const validator = require('validator');

const vSchema = new Schema({
  e_id:{
    type: String,
    required: true
  },
  p_id:{
    type: String,
    required: true
  },
  c_id:{
    type: String,
    required: true
  },
  v_id:{
    type: String,
    required: true
  }
});


module.exports = mongoose.model('Vote', vSchema)

