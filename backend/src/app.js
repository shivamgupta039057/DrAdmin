const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use((req, res, next) => {
  next();
});

app.use(cors());
app.use(express.json());
app.use((req, res, next) => {
  // res.setHeader("Referrer-Policy", "no-referrer-when-downgrade");
  next();
});

app.use(cookieParser());
require('./routes')(app)
// app.options("*", cors(corsOptions));

module.exports = { app }