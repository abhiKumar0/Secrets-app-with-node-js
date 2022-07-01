
const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");

const app = express();

app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect("mongodb://localhost:27017/userDB")

const userSchema = new mongoose.Schema({
    email: String,
    password: String
});

const secret = "Thisisveryhardtounderstand.";

userSchema.plugin(encrypt, {secret: secret, encryptedFields: ["password"] });

const User = mongoose.model("User", userSchema);

app.get("/", (req, res) => {
    res.render("home");
});

app.get("/register", (req, res) => {
    res.render("register");
});

app.get("/login", (req, res) => {
    res.render("login");
});

app.post("/register", (req, res) => {
    const newUser = new User({
        email: req.body.email,
        password: req.body.password
    })

    newUser.save((err) => {
        if (err) {
            console.log(err)
        } else {
            res.render("secrets");
        }
    });
})

app.post("/login", (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    console.log(email, password)

    User.findOne({email: email}, (err, foundUser) => {
        if (err){
            console.log(err)
        } else {
            if (foundUser) {
                if (foundUser.password === password) {
                    res.render("secrets");
                    console.log("Password matched.")
                } else {
                    console.log("Password didn't match.")
                }
            }
        }
    })

})




app.listen(3000, () => {
    console.log("Server started on port 3000")
})
