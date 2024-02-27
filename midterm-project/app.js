Vue.createApp({
  // data, methods, and created are elements of the Vue app.
  // data is a function that returns an object that represents all data in app
  data: function () {
    return {
      users: [
        {
          id: 1,
          name: "Anjolie",
          birthday: "2001-10-19",
          email: "anjoliekatecummins@gmail.com",
          password: "1234",
          destinations: ["Paris", "London", "New York"],
          interests: ["painting", "coffee", "hiking"],
        },
      ],
      errorMessages: {},
    };
  },

  // object with more keys inside it.
  methods: {
    validateReturningUserInputs: function () {
      this.errorMessages = {};
      if (
        this.returningUserEmail == undefined ||
        this.returningUserEmail == ""
      ) {
        this.errorMessages["user.email"] = "Email is required.";
      }
      if (
        this.returningUserPassword == undefined ||
        this.returningUserPassword == ""
      ) {
        this.errorMessages["user.password"] = "Password is required.";
      }
      return this.userIsValid;
    },

    validateNewUserInputs: function () {
      this.errorMessages = {};
      if (this.newUserName == undefined || this.newUserName == "") {
        this.errorMessages["user.name"] = "Name is required.";
      }
      if (this.newUserBirthday == undefined || this.newUserBirthday == "") {
        this.errorMessages["user.birthday"] = "Birthday is required.";
      }
      if (this.newUserEmail == undefined || this.newUserEmail == "") {
        this.errorMessages["user.email"] = "Email is required.";
      }
      if (this.newUserPassword == undefined || this.newUserPassword == "") {
        this.errorMessages["user.password"] = "Password is required.";
      }
      return this.userIsValid;
    },

    validateDestinationInputs: function () {
      this.errorMessages = {};
      if (
        this.newDestinationName == undefined ||
        this.newDestinationName == ""
      ) {
        this.errorMessages["user.destination"] = "Destination is required.";
      }

      return this.destinationIsValid;
    },

    validateInterestInputs: function () {
      this.errorMessages = {};
      if (this.newInterestName == undefined || this.newInterestName == "") {
        this.errorMessages["user.interest"] = "Interest is required.";
      }

      return this.destinationIsValid;
    },

    addUser: function () {
      if (this.validateNewUserInputs()) {
        var data = "name=" + encodeURIComponent(this.newUserName);
        data += "&birthday=" + encodeURIComponent(this.newUserBirthday);
        data += "&email=" + encodeURIComponent(this.newUserEmail);
        data += "&password=" + encodeURIComponent(this.newUserPassword);
        console.log("data: ", data);
        const requestOptions = {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: data,
        };
        fetch("http://localhost:8080/users", requestOptions).then(
          (response) => {
            if (response.status == 201) {
              this.loadUsersCollection();
              console.log("user added.");
            }
          }
        );
      }
    },

    addDestination: function (userId) {
      const user = this.users.find((user) => user.id == userId);
      if (user) {
        user.destinations.push(this.newDestinationName);
      } else {
        console.log("User not found.");
      }
      if (this.validateDestinationInputs()) {
        var data = "destination=" + encodeURIComponent(this.newDestinationName);
        console.log("data: ", data);
        const requestOptions = {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: data,
        };
        fetch("http://localhost:8080/destinations", requestOptions).then(
          (response) => {
            if (response.status == 201) {
              this.loadDestinationsCollection();
              console.log("destination added.");
            }
          }
        );
      }
    },

    addInterest: function (userId) {
      const user = this.users.find((user) => user.id == userId);
      if (user) {
        user.interests.push(this.newInterestName);
      } else {
        console.log("User not found.");
      }
      if (this.validateInterestInputs()) {
        var data = "interest=" + encodeURIComponent(this.newInterestName);
        console.log("data: ", data);
        const requestOptions = {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: data,
        };
        fetch("http://localhost:8080/interests", requestOptions).then(
          (response) => {
            if (response.status == 201) {
              this.loadInterestsCollection();
              console.log("interest added.");
            }
          }
        );
      }
    },

    loadUsersCollection: function () {
      fetch("http://localhost:8080/users").then((response) => {
        // contains the status code, headers, and body etc.
        if (response.status == 200) {
          response.json().then((TravelsFromServer) => {
            // use arrow function instead to continue the value of this.
            console.log("recieved foods from API: ", TravelsFromServer);
            this.travels = TravelsFromServer;
          });
        }
      });
    },

    loadDestinationsCollection: function () {
      fetch("http://localhost:8080/users/:id/destinations").then((response) => {
        if (response.status == 200) {
          response.json().then((destinationsFromServer) => {
            console.log(
              "received destinations from API: ",
              destinationsFromServer
            );
            const user = this.users.find((user) => user.id == user);
            if (user) {
              user.destinations = destinationsFromServer;
            } else {
              console.log("User not found.");
            }
          });
        }
      });
    },
    loadInterestsCollection: function () {
      fetch("http://localhost:8080/users/:id/interests").then((response) => {
        if (response.status == 200) {
          response.json().then((interestsFromServer) => {
            console.log("received interests from API: ", interestsFromServer);
            const user = this.users.find((user) => user.id == user);
            if (user) {
              user.interests = interestsFromServer;
            } else {
              console.log("User not found.");
            }
          });
        }
      });
    },

    computed: {
      destinationIsValid: function () {
        return Object.keys(this.errorMessages.length) == 0;
      },
    },
    errorMessageForField: function (fieldName) {
      return this.errorMessages[fieldName];
    },
    errorStyleForField: function (fieldName) {
      if (this.errorMessageForField(fieldName)) {
        return { border: "1px solid red" };
      } else {
        return {};
      }
    },
  },

  // IDs and classes only meant for css purposes shouldn't have to query them for js or for automated behaviour tests
  // created is a function that gets called once when it loads
  // this is like self in python. this.data_attribute or this.method_name
  // v-on establishes an event listener its a directive, data binding, rendering
  created: function () {
    console.log("Hello, vue.");
    this.loadDestinationsCollection();
    this.loadInterestsCollection();
  },
}).mount("#app");
