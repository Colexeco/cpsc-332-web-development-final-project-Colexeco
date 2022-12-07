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

const sanitize = require("mongo-sanitize");

const Validator = require("validatorjs");

var userRules = {
    email: "required|email",
    password: "required|string|min:6|confirmed"
}

var projectRules = {
    title: "required|string",
    description: "required|string",
    deadline: "required|date",
    completed: "boolean",
}

const projectSchema = new mongoose.Schema({
    title: String,
    description: String,
    deadline: Date,
    completed: Boolean,
    numtasks: Number,
    tasks: [{
        title: String,
        description: String,
        deadline: Date,
        completed: Boolean,
    }],
});

const projectResult = mongoose.model("projectResult", projectSchema);

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
        email: userData.email
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

//for logging out of app
app.get("/logout", function(req, res, next) {
    if (req.session) {
        req.session.destroy(function (err) {
            if (err) {
                return next(err);
            } else {
                return res.redirect('/');
            }
        });
    }
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

app.get("/viewProject", (req, res) => {

    if (req.session.userId) {
        //authenticate before proceeding
        validateSession(req.session.userId, res);
        res.render("viewProjects.ejs");
    } else { //not logged in
        return res.redirect("/login");
    }
});

//CREATE
app.post("/viewProjects", (req, res) => {

    if (req.session.userId) {
        //authenticate before proceeding
        validateSession(req.session.userId, res);

        console.log("Project Data:");
        console.log(req.body);

        let tasksArr = []

        if (req.body.numtasks > 0) { //tasks are dynamically generated by user,
            //so there is a variable number of them for each project
            //loop through tasks here to grab their input fields for all tasks
            for (let index = 0; index < req.body.numtasks; index++) {
                let taskTitleString = `taskTitle${req.body.numtasks}`
                let taskTitle = req.body.taskTitleString

                let taskDescriptionString = `taskDescription${req.body.numtasks}`
                let taskDescription = req.body.taskDescriptionString

                let taskDeadlineString = `taskDeadline${req.body.numtasks}`
                let taskDeadline = req.body.taskDeadlineString

                let taskCompletedString = `taskCompleted${req.body.numtasks}`
                let taskCompleted = req.body.taskCompleted

                let currTask = {
                    title: taskTitle,
                    description: taskDescription,
                    deadline: taskDeadline,
                    completed: taskCompleted,
                }

                tasksArr.push(currTask)
            }
        }

        let result = projectResult(
            {
                title: req.body.title,
                description: req.body.description,
                deadline: req.body.deadline,
                completed: req.body.completed == undefined ? false : true,
                numtasks: req.body.numtasks,
                tasks: tasksArr,
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
                console.log("Results: " + results)
                res.render("viewProjects.ejs", {
                    projectResults: results,
                });
            });
    } else { //not logged in
        return res.redirect("/login");
    }
});

//UPDATE
app.route("/edit/:id")
    .get((req, res) => {
        if (req.session.userId) {
            validateSession(req.session.userId, res);

            let id = req.params.id;

            id = sanitize(id);

            projectResult.findById(
                id,
                (err, results) => {

                    if (err) {
                        return res.render("error.ejs", {
                            errors: err
                        });
                    }

                    console.log("Found project! ");
                    console.log(results);

                    let result = {
                        _id: id,
                        title: results.title,
                        description: results.description,
                        deadline: results.deadline,
                        completed: results.completed,
                        tasks: results.tasks,
                    }

                    res.render("editProject.ejs", {
                        response: result
                    });
                });
        } else { //not logged in
            return res.redirect("/login");
        }
    })
    .post(function (req, res) {
        if (req.session.userId) {
            validateSession(req.session, res);

            let id = req.params.id;

            let title = req.body.title;
            let description = req.body.description;
            let deadline = req.body.deadline;
            let completed = req.body.completed;
            let tasks = req.body.tasks;

            //create an object it's possible to validate on
            let data = {
                title: title, 
                description: description,
                deadline: deadline,
                completed: completed,
                tasks: tasks
            }

            //validate
            let validation = new Validator(data, projectRules,
                {
                    required: "A valid :attribute is required",
                    boolean: ":attribute must be true/false",
                    email: "A valid email is required",
                    date: "Please provide a valid date",
                });
            
            console.log("Validation Passes: " + validation.passes() + " Validation Fails: " + validation.fails());

            if (validation.fails()) {
                let errorsList = {
                    title: validation.errors.first("title"),
                    description: validation.errors.first("description"),
                    deadline: validation.errors.first("deadline"),
                    completed: validation.errors.first("completed")
                };

                res.render("error.ejs", {
                    errors: 3,
                    errors: errorsList,
                });
            } else {

                projectResult
                .where({_id: id })
                .updateOne({
                    $set: {
                        title: title,
                        description: description,
                        deadline: deadline,
                        completed: completed,
                        tasks: tasks,
                    }
                })
                .exec(function (err, result) {
                    if (err) return res.send(err);
                    res.redirect("/viewProjects");
                    console.log(`Successfully updated ${result.modifiedCount} record`);
                });
            }
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
//DELETE
app.route("/delete/:id")
    .get((req, res) => {
        if (req.session.userId) {
            validateSession(req.session.userId, res);

            let id = req.params.id;

            projectResult.findById(
                id,
                (err, results) => {
                    console.log(results)

                    let result = {
                        _id: id,
                        title: results.title,
                        description: results.description,
                        deadline: results.deadline,
                        completed: results.completed,
                        tasks: results.tasks,
                    };
                    console.log("We are about to delete: " +JSON.stringify(result));
                });

            projectResult.deleteOne(
                { _id: id },
                (err, result) => {
                    console.log(result);

                    console.log(`${result.deletedCount} record deleted`);
                    res.redirect("/viewProjects");
                })
        } else {
            return res.redirect("login");
        }
    });

    //end session
    app.get('/logout', function (req, res, next) {
        if (req.session) {
            req.session.destroy( function (err) {
                if (err) {
                    return next(err);
                } else {
                    return res.redirect('/');
                }
            });
        }
    });