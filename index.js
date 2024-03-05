const express = require("express");
const model = require("./model");
const cors = require("cors");
const app = express();
app.use(express.json());
const mongoose = require("mongoose");

// extended allows you to send different structures of URL encoded data
app.use(express.urlencoded({ extended: false }));
app.use(express.static("public"));

app.use(cors());

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

  model.User.findOne({ email: request.body.email }).then((user) => {
    if (user) {
      response.status(400).json({ error: "Email already exists" });
    } else {
      newUser
        .save()
        .then(() => {
          response.set("Access-Control-Allow-Origin", "*");
          response.status(201).send("User added");
        })
        .catch((error) => {
          console.error("Error adding user:", error);
          if (error instanceof mongoose.Error.ValidationError) {
            response.status(400).json({ error: error.message });
          } else {
            response.status(500).json({ error: "Internal server error" });
          }
        });
    }
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
      response.status(200).json({ userId: user._id });
    }
  });
});

// add a destination for a user
app.post("/users/:id/destinations", function (request, response) {
  const userId = request.params.id;
  const destination = request.body.destination;
  model.User.findById(userId)
    .then((user) => {
      if (!user) {
        response.status(404).json({ error: "User not found" });
      } else {
        user.destinations.push(destination);
        user.save().then(() => {
          response.status(201).json({ message: "Destination added" });
        });
      }
    })
    .catch((error) => {
      console.error("Error adding destination:", error);
      response.status(500).json({ error: "Internal server error" });
    });
});

app.post("/users/:id/interests", function (request, response) {
  const userId = request.params.id;
  const interest = request.body.interest;
  model.User.findById(userId)
    .then((user) => {
      if (!user) {
        response.status(404).json({ error: "User not found" });
      } else {
        user.interests.push(interest);
        user.save().then(() => {
          response.status(201).json({ message: "Interest added" });
        });
      }
    })
    .catch((error) => {
      console.error("Error adding interest:", error);
      response.status(500).json({ error: "Internal server error" });
    });
});

// remove a destination for a user
app.delete(
  "/users/:id/destinations/:destination",
  function (request, response) {
    model.User.findById(request.params.id).then((user) => {
      user.destinations.pull(request.params.destination);
      user.save().then(() => {
        response.set("Access-Control-Allow-Origin", "*");
        response.status(204).send("Destination removed");
      });
    });
  }
);

// remove an interest for a user
app.delete("/users/:id/interests/:interest", function (request, response) {
  model.User.findById(request.params.id).then((user) => {
    user.interests.pull(request.params.interest);
    user.save().then(() => {
      response.set("Access-Control-Allow-Origin", "*");
      response.status(204).send("Interest removed");
    });
  });
});

// update a users info
app.put("/users/:id", function (request, response) {
  const userId = request.params.id;
  const userData = request.body;
  console.log("userData: ", userData.name, userData.birthday, userData.email);
  model.User.findByIdAndUpdate(userId, userData, { new: true })
    .then((user) => {
      user.save().then(() => {
        if (!user) {
          return response.status(404).send("User not found");
        }
        user.name = userData.name;
        user.birthday = userData.birthday;
        user.email = userData.email;
        console.log("user: ", user);
        response.set("Access-Control-Allow-Origin", "*");
        response.status(201).send("User updated successfully");
      });
    })
    .catch((error) => {
      console.error("Error updating user:", error);
      response.status(500).send("Internal server error");
    });
});

app.listen(8080, function () {
  console.log("Server is running...");
});
