const express = require("express");
const model = require("./model");
const app = express();

// extended allows you to send different structures of URL encoded data
app.use(express.urlencoded({ extended: false }));

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

app.listen(8080, function () {
  console.log("Server is running...");
});
