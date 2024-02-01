const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const accountRoute = require("./routes/accountRoute");
require("dotenv").config();

const app = express();
app.set("view engine", "ejs");

app.use(bodyParser.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(bodyParser.json());

// use routes
app.use("/api", accountRoute);

app.get("/", (req, res) => {
  res.json({
    message: "Welcome to the backend",
  });
});

// connect to database
try {
  mongoose.connect(process.env.MONGO_URI);
  console.log("Database connected");
} catch (error) {
  console.log(error);
}

app.listen(process.env.PORT, () => {
  console.log(`Server is running on http://localhost:${process.env.PORT}`);
});
