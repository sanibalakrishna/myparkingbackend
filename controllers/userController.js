const { default: mongoose } = require("mongoose");
const { User, Booking } = require("../models/userModel");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: "balakrishna1431313@gmail.com",
    pass: process.env.EMAIL_SECRET,
  },
});
async function sendPasswordResetLink(email, token) {
  const mailOptions = {
    from: "sanibalakrishna@gmail.com",
    to: email,
    subject: "Reset your password",
    text: `Click the link below to reset your password:\n\nhttp://localhost:3000/reset-password?token=${token}`,
  };
  await transporter.sendMail(mailOptions);
}

const createToken = (_id) => {
  return jwt.sign({ _id }, process.env.SECERT, { expiresIn: "3d" });
};
// login user
const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.login(email, password);
    const token = createToken(user._id);
    res.status(200).json({ name: user.name, email, token });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
const signupUser = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const user = await User.signup(name, email, password);
    const token = createToken(user._id);
    res.status(200).json({ name: user.name, email, token });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getUser = async (req, res) => {
  const id = req.user._id.toString();
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ message: "no such user found" });
  }
  const user = await User.findById(id);
  if (!user) {
    return res.status(404).json({ message: "no such user found" });
  }
  res
    .status(200)
    .json({ name: user.name, email: user.email, bookings: user.bookings });
};
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      res.status(404).json({ message: "No such user found" });
    }
    const token = await user.generatePasswordResetToken();
    await sendPasswordResetLink(email, token);
    res.status(200).json({ token });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

const updatePassword = async (req, res) => {
  try {
    const { token, password } = req.body;
    const user = await User.findOne({ passwordResetToken: token });
    if (!user) {
      res.status(404).json({ message: "Invalid Token" });
    }
    await user.updatePassword(password);
    res.status(200).json({ message: "Password Updated Succefully" });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

const updateBooking = async (req, res) => {
  // const{typeofvehicle,timeperiod,dateofparking,vehiclenumber}=req.body;
  const id = req.user._id.toString();
  const{slotno,typeofvehicle,timeperiod,dateofparking,vehiclenumber}=req.body;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ message: "no such user found" });
  }
  const tempdateofparking = new Date(dateofparking);
  const temptimeperiod = new Date(timeperiod);
  const tempbooking = await Booking.create({slotno,typeofvehicle,timeperiod:temptimeperiod,dateofparking:tempdateofparking,vehiclenumber});
  const updateuser = await User.findOneAndUpdate(
    { _id: id },
    { $push: { bookings: tempbooking } }
  );

  if (!updateuser) {
    return res.status(404).json({ message: "no such user found" });
  }
  return res.status(200).json({ message: "Booking added Successfully" });
};

const deleteBooking = async (req, res) => {
  // const{typeofvehicle,timeperiod,dateofparking,vehiclenumber}=req.body;
  const userid = req.user._id.toString();
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ message: "no such user found" });
  }

  const updateuser = await User.findOneAndUpdate(
    { _id: userid },
    { $pull: { bookings: id } }
  );

  if (!updateuser) {
    return res.status(404).json({ message: "no such user found" });
  }
  return res.status(200).json({ message: "Booking deleted Successfully" });
};
module.exports = {
  loginUser,
  signupUser,
  updateBooking,
  deleteBooking,
  getUser,
  updatePassword,
  forgotPassword,
};
