const { default: mongoose } = require("mongoose");
const { User, Booking } = require("../models/userModel");

const getBookings = async (req, res) => {
  const bookings = await Booking.find({});

  res.status(200).json(bookings);
};

const getBookingsbyDate = async (req, res) => {
  const { date } = req.body;
  const targetDate = new Date(date);
  const targetDateStr = targetDate.toLocaleString("en-US", {
    timeZone: "Asia/Kolkata",
  });
  const bookings = await Booking.find({
    $and: [
      { timeperiod: { $gte: targetDate } },
      { dateofparking: { $lte: targetDate } },
    ],
  });
  if (!bookings) {
    res.status(400).json({ message: "no such bookings are found" });
  }

  res.status(200).json(bookings);
};

const deleteBookings = async (req, res) => {
  const bookings = await Booking.deleteMany();
  res.status(200).json({ message: "booking deleted succefullyy" });
};

module.exports = { getBookings, getBookingsbyDate, deleteBookings };
