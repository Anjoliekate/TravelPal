const express = require("express");
const model = require("./model");
const cors = require("cors");
const app = express();

// extended allows you to send different structures of URL encoded data
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use(express.static("public"));

// get all users
app.get("/users", function (request, response) {
  model.User.find().then((users) => {
    response.set("Access-Control-Allow-Origin", "*");
    response.json(users);
    console.log("users from DB: ", users);
  });
});

//get a single user
app.get("/users/:id", function (request, response) {
  model.User.findById(request.params.id).then((user) => {
    response.set("Access-Control-Allow-Origin", "*");
    response.json(user);
  });
});

//get destinations for a user
app.get("/users/:id/destinations", function (request, response) {
  model.User.findById(request.params.id).then((user) => {
    response.set("Access-Control-Allow-Origin", "*");
    response.json(user.destinations);
  });
});

//get interests for a user
app.get("/users/:id/interests", function (request, response) {
  model.User.findById(request.params.id).then((user) => {
    response.set("Access-Control-Allow-Origin", "*");
    response.json(user.interests);
  });
});

// add a user
app.post("/users", function (request, response) {
  const newUser = new model.User({
    name: request.body.name,
    birthday: request.body.birthday,
    email: request.body.email,
    password: request.body.password,
  });
  newUser.save().then(() => {
    response.set("Access-Control-Allow-Origin", "*");
    response.status(201).send("User added");
  });
});

// check if user exists
app.post("/login", function (request, response) {
  const email = request.body.email;
  const password = request.body.password;
  //find the user by email in db
  model.User.findOne({ email: email }).then((user) => {
    if (!user || user.password !== password) {
      response.status(401).send("Invalid credentials");
    } else {
      // authentication successful
      response.set("Access-Control-Allow-Origin", "*");
      response.status(200).send("Authentication successful");
      response.userId = user._id;
    }
  });
});

// add a destination for a user
app.post("/users/:id/destinations", function (request, response) {
  model.User.findById(request.params.id).then((user) => {
    user.destinations.push(request.body.destination);
    user.save().then(() => {
      response.set("Access-Control-Allow-Origin", "*");
      response.status(201).send("Destination added");
    });
  });
});

app.listen(8080, function () {
  console.log("Server is running...");
});
