const express = require("express");
const app = express();

app.use(express.urlencoded({
    extended: true,
}));

app.set("view engine", "ejs");

const PORT = 8080;

app.listen(PORT, function () {
    console.log("Server listening port " + PORT);
});

const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema({
    title: String,
    description: String,
    deadline: Date,
    completed: Boolean,
    tasks: [{
        title: String,
        description: String,
        deadline: Date,
        completed: Boolean,
    }]
});

const projectResult = mongoose.model("ProjectResult", projectSchema);

const url = "mongodb://127.0.0.1:27017/";
const DB_NAME = "projectDB";

mongoose.connect(url + DB_NAME, { useNewUrlParser: true });

const bcrypt = require("bcrypt");

//schema for project users
var UserSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
    }
});

UserSchema.pre('save', function (next) {
    var user = this;
    //https://stackoverflow.com/questions/6832445/how-can-bcrypt-have-built-in-salts
    bcrypt.hash(user.password, 10, function(err, hash) {
        if (err) {
            return next(err);
        }
        user.password = hash;
        next();
    })
});

//authenticate user credentials against database
UserSchema.statics.authenticate = function (userData, req, res) {
    userCredentials.findOne({
        username: userData.email
    })
        .exec(function (err, user) {
            if (err) {
                return res.render("error.ejs", {
                    errors: 2
                });
            } else if (!user) {
                var err = new Error('User not found.');
                err.status = 401;
                //error
                return res.render("error.ejs", {
                    errors: 2
                });
            }
            //if we get here, we did not hit an error...
            bcrypt.compare(userData.password, user.password, function (err, result) {
                if (result == true) { //password hashes match
                    //set up session cookie
                    req.session.userId = user._id;
                    return res.render("newProject.ejs");
                } else {
                    return res.redirect("/login");
                }
            })
        });
}

const userCredentials = mongoose.model("UserCredentials", UserSchema);

const session = require('express-session');

app.use(session({
    secret: "Secret environment variable string",
    resave: true,
    saveUninitialized: false
}));

app.get("/", function(req, res) {
    return res.redirect("/login");
});

app.route("/signUp")
    .get((req, res) => {
        let errors = {
            emailError: "",
        }
        res.render("signUp.ejs", errors);
    })
    .post((req, res) => {
        if (req.body.email && req.body.password && req.body.passwordConfirmation) {
            var userData = userCredentials({
                email: req.body.email,
                password: req.body.password,
            });

            userData.save(function (err, user) {
                if (err) {
                    let errors = {
                        emailError: "Invalid email"
                    }
                    res.render("signUp.ejs", errors);
                } else {
                    return res.redirect("/newProject");
                }
            });
        }
    })

app.route("/login")
    .get((req, res) => {
        let errors = {
            emailError: ""
        }
        res.render("login.ejs", errors);
    })
    .post((req, res) => {
        if (req.body.email && req.body.password) {
            var userData = {
                email: req.body.email,
                password: req.body.password,
            }
            let temp = userCredentials.authenticate(userData, req, res);
        }
    });

app.get("/newProject", (req, res) => {

    if (req.session.userId) {
        //authenticate before proceeding
        validateSession(req.session.userId, res);
        res.render("newProject.ejs");
    } else { //not logged in
        return res.redirect("/login");
    }
});

//CREATE
app.post("/viewProjects", (req, res) => {

    if (req.session.userId) {
        //authenticate before proceeding
        validateSession(req.session.userId, res);

        console.log("Form Data:");
        console.log(req.body);

        let result = projectResult(
            {
                title: req.body.title,
                description: req.body.description,
                completed: req.body.completed == undefined ? false : true,
                tasks: req.body.task,
            });
        //Saving model data for our database as configured above
        result.save(
            (err, result) => {
                if (err) {
                    return console.log("Error: " + err);
                }
                console.log(`Success! Inserted data with _id: ${result._id} into the database`);
                console.log(result._doc);
                res.redirect("/viewProjects");
            });

    } else { //not logged in
        return res.redirect("/login");
    }
});

//READ
app.get("/viewProjects", (req, res) => {

    if (req.session.userId) {
        validateSession(req.session.userId, res);

        projectResult.find(
            {},
            (err, results) => {
                console.log(results)
                res.render("viewProjects.ejs", {
                    projectResults: results,
                });
            });
    } else { //not logged in
        return res.redirect("/login");
    }
});

function validateSession (_id, res) {
    if (_id != "" && _id != undefined) {
        //authenticate
        userCredentials.findOne({
            _id: _id
        }).exec(function (err, user) {
            if (err) {
                return res.render("error.ejs", {
                    errors: 2
                });
            } else if (!user) {
                var err = new Error('User not found.');
                err.status = 401;
                //error
                return res.render("error.ejs", {
                    errors: 2
                });
            }
            //authentication passed, give access
        })
    } else {
        //redirect to log in
        return res.redirect("/login");
    }
}