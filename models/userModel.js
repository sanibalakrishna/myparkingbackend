const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const validator = require("validator");
const crypto = require("crypto");
const Schema = mongoose.Schema;

const bookingSchema = new Schema({
  slotno: {
    type: Number,
    required: true,
  },
  typeofvehicle: {
    type: String,
    required: true,
  },
  timeperiod: {
    type: String,
    required: true,
  },
  dateofparking: {
    type: String,
    required: true,
  },
  vehiclenumber: {
    type: String,
    required: true,
  },
});

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  bookings: {
    type: [bookingSchema],
    default: [],
  },
  passwordResetToken: {
    type: String,
    default: null,
  },
  passwordResetExpires: {
    type: Date,
    default: null,
  },
});

userSchema.statics.signup = async function (name, email, password) {
  if (!name || !email || !password) {
    throw Error("All fields must be filled");
  }
  if (!validator.isEmail(email)) {
    throw Error("Please enter a valid email");
  }
  if (!validator.isStrongPassword(password)) {
    throw Error("Please entere a strong password");
  }
  const existinguser = await this.findOne({ email });
  if (existinguser) {
    throw Error("Email is already in use");
  }

  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);
  const user = await this.create({ name, email, password: hash });
  return user;
};

userSchema.statics.login = async function (email, password) {
  if (!email || !password) {
    throw Error("Please ensure all fields are filled");
  }
  const user = await this.findOne({ email });
  if (!user) {
    throw Error("Incorrect Email");
  }
  const passwordmatch = await bcrypt.compare(password, user.password);
  if (!passwordmatch) {
    throw Error("Incorrect Password");
  }
  return user;
};

userSchema.methods.generatePasswordResetToken = async function () {
  const token = crypto.randomBytes(20).toString("hex");
  this.passwordResetToken = token;
  this.passwordResetExpires = Date.now() + 3600000;
  await this.save();
  return token;
};
userSchema.methods.updatePassword = async function (newpassword) {
  if (Date.now() > this.passwordResetExpires) {
    throw Error("Password reset link experied");
  }
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(newpassword, salt);
  this.password = hash;
  this.passwordResetExpires = null;
  this.passwordResetToken = null;
  await this.save();
};
const User = mongoose.model("User", userSchema);
const Booking = mongoose.model("Booking", bookingSchema);
module.exports = { User, Booking };
