const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const validator = require('validator');

const Schema = mongoose.Schema

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  name: {
    type: String ,
    required: true
  },
  gender: String,
  faculty: String,
  dept: String,
  dob: String,
  phone: String,
  photo: String,
  isAdmin: String
})

// static signup method
userSchema.statics.signup = async function(name, gender, faculty, dept, dob, phone, photo, email, password) {

  // validation
  if (!email || !password) {
    throw Error('All fields must be filled')
  }
  if (!validator.isEmail(email)) {
    throw Error('Email not valid')
  }
  if (!validator.isStrongPassword(password)) {
    throw Error('Password not strong enough')
  }

  const exists = await this.findOne({ email })

  if (exists) {
    throw Error('Email already in use')
  }

  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);
  const isAdmin = "1";

  const user = await this.create({ name, gender, faculty, dept, dob, phone, photo, isAdmin, email, password: hash });

  return user;
}

// static login method
userSchema.statics.login = async function(email, password, res) {

  let returnData = new Object();

  if(!email || !password) {
    
    returnData.status = 404;
    returnData.msg = "all fields must be filled!!!";

    res.send(returnData);

  }else{

    const user = await this.findOne({ email })

    if (!user) {

      returnData.status = 404;
      returnData.msg = "email not found!!!";

      res.send(returnData);

    }else{

      const match = await bcrypt.compare(password, user.password)

      if (!match) {
        returnData.status = 404;
        returnData.msg = "Incorrect password";

        res.send(returnData);

      }else{

        return user;
        
      }

    }
  }
}

userSchema.statics.check_password = async function(user, password){

  const match = await bcrypt.compare(password, user.password);

  if (!match) {
    return ('pasword not found');
  }else{
    return match;
  }

}

module.exports = mongoose.model('User', userSchema)