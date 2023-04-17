const express = require("express");
const {
  loginUser,
  signupUser,
  forgotPassword,
  updatePassword,
  getUser,
} = require("../controllers/userController");
const router = express.Router();
const requireAuth = require("../middlewares/requireAuth");

router.post("/login", loginUser);

router.post("/signup", signupUser);
router.get("/profile", requireAuth, getUser);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", updatePassword);

module.exports = router;
