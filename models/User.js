const mongoose = require('mongoose');
const { Schema } = mongoose;
const bcrypt = require('bcrypt');
require('dotenv').config();

const UserSchema = new Schema({
  email: {
    type: String,
    unique: true,
    required: true,
    match: [/[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+/, 'Bad email provided'],
  },
  username: {
    type: String,
    unique: true,
    trim: true,
    required: true,
    validate: [({ length }) => length >= 2, 'Username too short.'],
  },
  password: {
    type: String,
    required: true,
  },
});

UserSchema.pre('save', async function (next) {
  try {
    const regex =
      /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$/;
    if (!this.password.match(regex)) {
      return next(new Error('Password failed validation'));
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    return next();
  } catch (err) {
    return next(err);
  }
});

UserSchema.pre('updateOne', async function (next) {
  try {
    const regex =
      /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$/;
    if (!this.password.match(regex)) {
      return next(new Error('Password failed validation'));
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    return next();
  } catch (err) {
    return next(err);
  }
});

UserSchema.methods.checkPassword = async function (input) {
  try {
    return await bcrypt.compare(input, this.password);
  } catch (err) {
    return err;
  }
};

const User = mongoose.model('User', UserSchema);

module.exports = User;
