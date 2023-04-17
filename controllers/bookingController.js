const { default: mongoose } = require("mongoose");
const { User, Booking } = require("../models/userModel");

const getBookings = async (req, res) => {
  const bookings = await Booking.find({});

  res.status(200).json(bookings);
};

module.exports = { getBookings };
