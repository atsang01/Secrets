//jshint esversion:6
require("dotenv").config();
const express = require("express");
const app = express();
const ejs = require("ejs");
const bodyParser = require("body-parser");
const port = process.env.PORT || 3000;
const mongoose = require("mongoose");

const bcrypt = require("bcrypt");
const saltRounds = 10;


mongoose.connect("mongodb://localhost:27017/userDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const userSchema = new mongoose.Schema({
  email: String,
  password: String
});

// This go to .env
// const secret = "ThisisAllenTsangSpeaking!";

// userSchema.plugin(encrypt,{secret:secret});
// userSchema.plugin(encrypt,{secret:process.env.SECRET, encryptedFields:['password']});

const User = new mongoose.model("User", userSchema);


app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({
  extended: true
}));

app.get("/", function(req, res) {
  res.render("home");
});

app.get("/login", function(req, res) {
  res.render("login");
});

app.get("/register", function(req, res) {
  res.render("register");
});

app.post("/register", function(req, res) {

  bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
    if (!err) {
      const newUser = new User({
        email: req.body.username,
        password: hash
      });
      newUser.save(function(err) {
        if (err) {
          console.log(err);
        } else {
          res.render("secrets");
        };
      });
    } else {
      console.log(err);
    }

  });

});

app.post("/login", function(req, res) {

    const username = req.body.username;
    const password = req.body.password;

    User.findOne({
      email: username
    }, function(err, foundUser) {
      if (err) {
        console.log(err);
      } else {
        if (foundUser) {

          bcrypt.compare(password, foundUser.password, function(err, result){
            if(result === true){
              res.render("secrets");
            } else {
              console.log(err);
            }
          });
        }
      }
    });



});

app.listen(port, function() {
  console.log("Server started sucessfully!");
});
