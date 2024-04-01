const express = require("express");
const model = require("./model");
const cors = require("cors");
const app = express();
app.use(express.json());
const mongoose = require("mongoose");
const session = require("express-session");
const bcrypt = require("bcrypt");

// extended allows you to send different structures of URL encoded data
app.use(express.urlencoded({ extended: false }));
app.use(express.static("public"));
app.use(
  cors({
    credentials: true,
    origin: function (origin, callback) {
      callback(null, origin);
    },
  })
);

app.use(
  session({
    secret: "oijxlvkcoxizcvoihdzopojnfldosv",
    saveUninitialized: true,
    resave: false,
    secure: true,
    cookie: { secure: true },
    sameSite: "None",
  })
);

//middlewares are gatekeeper of whether or not request is authorized
//*
function authorizeRequest(adminOnly) {
  return function (request, response, next) {
    if (request.session || request.session.userId) {
      model.User.findOne({ _id: request.session.userId }).then(function (user) {
        //!user.admin would cause admin to not be able to do non admin activities they are mutually exclusive
        if (user) {
          if (!adminOnly || user.admin) {
            request.user = user;
            next();
          }
        } else {
          response
            .status(401)
            .send(
              "zombie orphan session from old user, user doesn't exist",
              user
            );
        }
      });
    } else {
      response
        .status(401)
        .send("session or session with this user does not exist");
    }
  };
}
//called in each request authorizeRequest(false) means non admin action and true means admin only (put on my delete methods)
//*

// get all users
//* add function name "authorizeRequest" to any requests that need to be authorized, except for signing up
app.get("/users", function (request, response) {
  model.User.find().then((users) => {
    response.set("Access-Control-Allow-Origin", "*");
    response.json(users);
    console.log("users from DB: ", users);
  });
});

//get a single user
app.get("/users/:id", authorizeRequest(false), function (request, response) {
  model.User.findById(request.params.id).then((user) => {
    response.set("Access-Control-Allow-Origin", "*");
    response.json(user);
  });
});

//get destinations for a user
app.get(
  "/users/:id/destinations",
  authorizeRequest(false),
  function (request, response) {
    model.User.findById(request.params.id).then((user) => {
      response.set("Access-Control-Allow-Origin", "*");
      response.json(user.destinations);
    });
  }
);

//get interests for a user
app.get(
  "/users/:id/interests",
  authorizeRequest(false),
  function (request, response) {
    model.User.findById(request.params.id).then((user) => {
      response.set("Access-Control-Allow-Origin", "*");
      response.json(user.interests);
    });
  }
);

// add a user
app.post("/users", function (request, response) {
  const newUser = new model.User({
    name: request.body.name,
    birthday: request.body.birthday,
    email: request.body.email,
    password: request.body.password,
    user: request.session.userId,
  });
  model.User.findOne({ email: request.body.email }).then((existingUser) => {
    if (existingUser) {
      response.status(400).json({ error: "Email already exists" });
    } else {
      console.log("plain password:", newUser.password);
      newUser.setEncryptedPassword(newUser.password).then(function () {
        newUser
          .save()
          .then(() => {
            const responseData = {
              _id: newUser._id,
              name: newUser.name,
              birthday: newUser.birthday,
              email: newUser.email,
              destinations: newUser.destinations,
              interests: newUser.interests,
              __v: newUser.__v,
            };
            response.set("Access-Control-Allow-Origin", "*");
            response.status(201).json(responseData);
          })
          .catch((error) => {
            if (error.errors) {
              var errorMessages = {};
              for (var fieldName in error.errors) {
                errorMessages[fieldName] = error.errors[fieldName].message;
              }
              response.status(422).json(errorMessages);
            } else {
              console.log("Unknown error creating user: ", error);
              response.status(500).send("Unknown error creating user");
            }
          });
      });
    }
  });
});

app.post("/login", function (request, response) {
  const email = request.body.email;
  const password = request.body.password;

  model.User.findOne({ email: email }).then((user) => {
    if (!user) {
      response.status(401).send("Invalid email or password");
    } else {
      user.verifyEncryptedPassword(password).then((match) => {
        if (match) {
          request.session.userId = user._id;
          response.set("Access-Control-Allow-Origin", "*");
          response.status(200).json({ userId: user._id });
        } else {
          response.status(401).send("Invalid email or password");
        }
      });
    }
  });
});

//*
// authentication: create session
app.get("/session", authorizeRequest(false), function (request, response) {
  response.set("Access-Control-Allow-Origin", "*");
  response.status(401).send("Not Authenticated");
});

// authentication: delete session
app.delete("/session", authorizeRequest(false), function (request, response) {
  request.session.userId = null;
  response.set("Access-Control-Allow-Origin", "*");
  response.status(200).send("Logged out");
});
//*

app.post("/session", authorizeRequest(false), function (request, response) {
  // access users given credentials: request.body.email & request.body.plainPassword
  model.User.findOne({ email: request.body.email }).then((user) => {
    if (user) {
      user
        .verifyEncryptedPassword(request.body.plainPassword)
        .then(function (match) {
          if (match) {
            //TODO: save the users ID into session data
            //set to null if deleteing session
            request.session.userId = user._id;
            response.set("Access-Control-Allow-Origin", "*");
            response.status(201).send("authenticated");
          } else {
            response.status(401).send("not authenticated");
          }
        });
    } else {
      response.status(401).send("not authenticated");
    }
  });
});

// add a destination for a user
app.post(
  "/users/:id/destinations",
  authorizeRequest(false),
  function (request, response) {
    const userId = request.params.id;
    const destination = request.body.destination;
    model.User.findById(userId)
      .then((user) => {
        if (!user) {
          response.status(404).json({ error: "User not found" });
        } else {
          user.destinations.push(destination);
          user.save().then(() => {
            response.set("Access-Control-Allow-Origin", "*");
            response.status(201).json({ message: "Destination added" });
          });
        }
      })
      .catch((error) => {
        console.error("Error adding destination:", error);
        response.status(500).json({ error: "Internal server error" });
      });
  }
);

app.post(
  "/users/:id/interests",
  authorizeRequest(false),
  function (request, response) {
    const userId = request.params.id;
    const interest = request.body.interest;
    model.User.findById(userId)
      .then((user) => {
        if (!user) {
          response.status(404).json({ error: "User not found" });
        } else {
          user.interests.push(interest);
          user.save().then(() => {
            response.set("Access-Control-Allow-Origin", "*");
            response.status(201).json({ message: "Interest added" });
          });
        }
      })
      .catch((error) => {
        console.error("Error adding interest:", error);
        response.status(500).json({ error: "Internal server error" });
      });
  }
);

// remove a destination for a user
app.delete(
  "/users/:id/destinations/:destination",
  authorizeRequest(true),
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
app.delete(
  "/users/:id/interests/:interest",
  authorizeRequest(true),
  function (request, response) {
    model.User.findById(request.params.id).then((user) => {
      user.interests.pull({
        interest: request.params.interest,
      });
      user.save().then(() => {
        response.set("Access-Control-Allow-Origin", "*");
        response.status(204).send("Interest removed");
      });
    });
  }
);

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
