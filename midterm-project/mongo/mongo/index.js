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

// add a user
app.post("/users", function (request, response) {
  const newUser = {
    name: request.body.name,
    birthday: request.body.birthday,
    email: request.body.email,
    password: request.body.password,
  };
  newUser.save().then(() => {
    response.set("Access-Control-Allow-Origin", "*");
    response.status(201).send("User added");
  });
});

// get all destinations
app.get("/users/:id/destinations", function (request, response) {
  model.Destination.find({ user: request.params.id }).then((destinations) => {
    response.set("Access-Control-Allow-Origin", "*");
    response.json(destinations);
    console.log("destinations from DB: ", destinations);
  });
});

// add a destination
app.post("/destinations", function (request, response) {
  const newDestination = new model.Destination({
    destination: request.body.destination,
  });
  newDestination.save().then(() => {
    response.set("Access-Control-Allow-Origin", "*");
    response
      .status(201)
      .send("Destination added")
      .catch((error) => {
        //if mongoose validation failed
        if (error.errors) {
          var errorMessages = {};
          for (var fieldName in error.errors) {
            errorMessages[fieldName] = error.errors[fieldName].message;
          }
          response.status(422).json(errorMessages);
        } else {
          response.status(500).send("Unknown error creating destination.");
        }
      });
  });
});

// add an interest
app.post("/interest", function (request, response) {
  const newInterest = new model.Interest({
    interest: request.body.interest,
  });
  newInterest.save().then(() => {
    response.set("Access-Control-Allow-Origin", "*");
    response
      .status(201)
      .send("Interest added")
      .catch((error) => {
        //if mongoose validation failed
        if (error.errors) {
          var errorMessages = {};
          for (var fieldName in error.errors) {
            errorMessages[fieldName] = error.errors[fieldName].message;
          }
          response.status(422).json(errorMessages);
        } else {
          response.status(500).send("Unknown error creating interest.");
        }
      });
  });
});

app.listen(8080, function () {
  console.log("Server is running...");
});
