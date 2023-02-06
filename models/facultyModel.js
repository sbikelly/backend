const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');
const validator = require('validator');

const fSchema = new Schema({
  name: {
    type: String ,
    required: true
  }
});


module.exports = mongoose.model('Faculty', fSchema)

