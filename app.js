//jshint esversion:6
require("dotenv").config();
const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");

const app = express();

app.use(express.static("public"));
app.set("view engine","ejs");
app.use(bodyParser.urlencoded({
  extended: true
}));

mongoose.connect("mongodb://localhost:27017/userDB", {useNewUrlParser: true});

const userSchema = new mongoose.Schema({
  email: String,
  password: String
});

const secret = "NicholasTanglovesChristineNg";
userSchema.plugin(encrypt, {secret: process.env.SECRET, encryptedFields: ["password"]});

const User = new mongoose.model("User", userSchema);

app.get("/", function (req, res) {
  res.render("home");
});

app.route("/login")
.get(function (req, res) {
  res.render("login");
})
.post(function (req, res) {
  User.findOne({email: req.body.username}, function (err, foundUser) {
    if(err) {
      console.log(err);
    } else {
      if(foundUser.password === req.body.password) {
        res.render("secrets");
      } else {
        res.send("Your password is incorrect");
      }
    }
  });
});

app.route("/register")
.get(function (req, res) {
  res.render("register");
})
.post(function (req, res) {
  const newUser = new User({
    email: req.body.username,
    password: req.body.password
  });
  newUser.save(function (err) {
    if(err) {
      console.log(err);
    } else {
      res.render("secrets");
    }
  });
});



app.listen(3000, function (err) {
  if(!err) {
    console.log("Server is running on port 3000.");
  }
});
