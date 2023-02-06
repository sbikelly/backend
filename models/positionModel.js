const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');
const validator = require('validator');

const pSchema = new Schema({
  name: {
    type: String ,
    required: true
  },
  e_name: String ,

  e_id: String
});


module.exports = mongoose.model('Positn', pSchema)

