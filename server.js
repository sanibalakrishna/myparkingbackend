const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const userRoutes = require("./routes/userRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const app = express();

// middlewares
app.use(cors({ origin: "*" }));
app.use(express.json());

// connect to db
mongoose.set("strictQuery", false);
mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => {
    app.listen(5000, () => {
      console.log(`Server is live at 5000 and connected to database`);
    });
  })
  .catch((error) => {
    console.log(error);
  });

app.get("/", (req, res) => {
  res.send("Myparking Test Api");
});
app.use("/user", userRoutes);
app.use("/booking", bookingRoutes);

module.exports = app;
