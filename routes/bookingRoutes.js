const express = require("express");
const {
  getBookings,
  deleteBookings,
  getBookingsbyDate,
} = require("../controllers/bookingController");
const {
  updateBooking,
  deleteBooking,
} = require("../controllers/userController");
const requireAuth = require("../middlewares/requireAuth");
const router = express.Router();
router.get("/date", getBookingsbyDate);
router.post("/", requireAuth, updateBooking);
router.delete("/:id", requireAuth, deleteBooking);
router.get("/", getBookings);
router.delete("/", deleteBookings);

module.exports = router;
