//jshint esversion:6
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const md5 = require("md5");

const app = express();

app.use(express.static("public"));

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({extended: true}));

mongoose.connect("mongodb://localhost:27017/userDB");

const userSchema = new mongoose.Schema({
    username: String,
    password: String
});

const User = new mongoose.model("User", userSchema);

app.get("/", function(req, res){
    res.render("home");
});
app.get("/logout", function(req, res){
    res.render("home");
});

//user logi module
app.route("/login")
.get(function(req, res){
    res.render("login");
})
//query db and verify login details
.post(function(req, res){
    const userLogin = req.body.username;
    const password = md5(req.body.password);
    User.findOne({username:userLogin}, function(err, foundUser){
        if (!err){
            if (foundUser){
                if (foundUser.password === password){
                    res.render("secrets");
                }else{
                    res.send("User or password does not match");
                }
            }else{
                res.send("User or password does not match");
            }
        }else{
            res.send(err);
        }
    });
});

//register module
app.route("/register")
.get(function(req, res){
    res.render("register");
})
//save user login details
.post(function(req, res){
    const user = new User ({
        username: req.body.username,
        password: md5(req.body.password)
    });
    user.save(function(err){
        if (!err){
            res.render("secrets");
        }else{
            res.send(err);
        }
    });
}); 

app.route("/submit")
.get(function(req, res){
    res.render("submit")
});

//lunch app at port 3000
app.listen(3000, function(){
    console.log("app is running on port 3000");
});
