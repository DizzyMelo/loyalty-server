const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const userSchema = mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: [true, 'Name is required'],
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    required: [true, 'Email is required'],
    validate: [validator.isEmail, 'Invalid email'],
  },
  role: {
    type: String,
    default: 'user',
    enum: ['user', 'company'],
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password needs to have at least 6 characters'],
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Password confirmation is required'],
    validate: {
      validator: function (el) {
        return el === this.password;
      },
      message: 'Incorrect password',
    },
  },
});

userSchema.pre('save', async function (next) {
  //Runs only if password is modified
  if (!this.isModified('password')) return next();

  //encrypts the password
  this.password = await bcrypt.hash(this.password, 12);
  //delete the confirm
  this.passwordConfirm = undefined;
  next();
});

userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changePasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    return JWTTimestamp < changedTimestamp;
  }
  return false;
};

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');

  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  //console.log({ resetToken }, this.passwordResetToken);

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

const User = mongoose.model('User', userSchema);
module.exports = User;
