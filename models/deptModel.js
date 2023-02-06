const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');
const validator = require('validator');

const dSchema = new Schema({
  name: {
    type: String ,
    required: true
  },
  f_id: String,
  f_name: String
});


module.exports = mongoose.model('Dept', dSchema)

