var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cors = require("cors");
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var testAPIRouter = require("./routes/testAPI");
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use("/testAPI", testAPIRouter);
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

app.listen(8080, function () {
  console.log("Server listening on port " + 3000);
})

const mongoose = require("mongoose");

const userCredentials = new mongoose.Schema({
  email: String,
  password: String,
});

const userProfilePhoto = new mongoose.Schema({
  image : {
    data: Buffer,
    contentType: String,
  }
});

const projectSchema = new mongoose.Schema({
  title : String,
  description : String,
  deadline : Date,
})

const taskSchema = new mongoose.Schema({
  title : String,
  description : String,
  deadline : Date,
  completed : Boolean,
})

const credentialResult = mongoose.model("credentialResult", userCredentials);
const photoResult = mongoose.model("userProfilePhoto", userProfilePhoto);
const projectResult = mongoose.model("projectSchema", projectSchema);
const taskResult = mongoose.model("taskSchema", taskSchema);

const url = "mongodb://127.0.0.1:27017/";
const DB_NAME = "ProjectMangagementDB"

mongoose.connect(url + DB_NAME, { useNewUrlParser : true});

app.post("./credentials", (req, res) => {
  console.log("User credentials:");
  console.log(req.body)

  let result = credentialResult(
  {
    email: req.body.email,
    password: req.body.password,
  }
  );

  result.save(
    (err,result) => {
    if (err) {
        return console.log("Error: " + err);
    }
    
    console.log(`Success! Inserted data with _id: ${result._id} into the database.`);
    console.log(result._doc);
    }
  )

  res.redirect("/credentials")
})

module.exports = app;
