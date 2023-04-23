const { default: mongoose } = require("mongoose");
const { User, Booking } = require("../models/userModel");

const getBookings = async (req, res) => {
  const bookings = await Booking.find({});

  res.status(200).json(bookings);
};

const getBookingsbyDate = async (req, res) => {
  const { date } = req.body;
  const bookings = await Booking.find({
    $or: [
      { timeperiod: { $regex: `^${date}`, $options: "i" } },
      { dateofparking: { $regex: `^${date}`, $options: "i" } },
    ],
  });
  if(!bookings)
  {
    res.status(400).json({message:"no such bookings are found"})
  }

  res.status(200).json(bookings);
};

const deleteBookings = async (req, res) => {
  const bookings = await Booking.deleteMany();
  res.status(200).json({ message: "booking deleted succefullyy" });
};

module.exports = { getBookings, getBookingsbyDate, deleteBookings };
