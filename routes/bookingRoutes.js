const express = require("express");

const {
  updateBooking,
  deleteBooking,
} = require("../controllers/userController");
const requireAuth = require("../middlewares/requireAuth");
const router = express.Router();
router.post("/", requireAuth, updateBooking);
router.delete("/:id", requireAuth, deleteBooking);
module.exports = router;
