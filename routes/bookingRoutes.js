const express = require("express");
const { getBookings } = require("../controllers/bookingController");
const {
  updateBooking,
  deleteBooking,
} = require("../controllers/userController");
const requireAuth = require("../middlewares/requireAuth");
const router = express.Router();
router.post("/", requireAuth, updateBooking);
router.delete("/:id", requireAuth, deleteBooking);
router.get("/", getBookings);
module.exports = router;
