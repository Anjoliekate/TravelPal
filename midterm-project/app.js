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

    addUser: function () {
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
      fetch("http://localhost:8080/users", requestOptions).then((response) => {
        if (response.status == 201) {
          this.loadUsersCollection();
          console.log("user added.");
          //hide the sign up screen
          this.newUserName = "";
          this.newUserBirthday = "";
          this.newUserEmail = "";
          this.newUserPassword = "";
          this.displayLogin();
        }
      });
    },

    loginUser: function () {
      if (this.validateReturningUserInputs()) {
        fetch("http://localhost:8080/users").then((response) => {
          // contains the status code, headers, and body etc.
          if (response.status == 200) {
            response.json().then((usersFromServer) => {
              // use arrow function instead to continue the value of this.
              console.log("recieved users from API: ", usersFromServer);
              this.users = usersFromServer;
              for (var i = 0; i < this.users.length; i++) {
                if (
                  this.users[i].email == this.returningUserEmail &&
                  this.users[i].password == this.returningUserPassword
                ) {
                  console.log("user found");
                  this.loadUserDestinations(this.users[i].id);
                  this.loadUserInterests(this.users[i].id);
                  break;
                }
              }
            });
          }
        });
      }
    },

    loadUsersCollection: function () {
      fetch("http://localhost:8080/users").then((response) => {
        // contains the status code, headers, and body etc.
        if (response.status == 200) {
          response.json().then((TravelsFromServer) => {
            // use arrow function instead to continue the value of this.
            console.log("recieved users from API: ", TravelsFromServer);
            this.travels = TravelsFromServer;
          });
        }
      });
    },
    loadUserDestinations: function (userId) {
      fetch(`http://localhost:8080/users/${userId}/destinations`)
        .then((response) => response.json())
        .then((destinations) => {
          console.log("User Destinations:", destinations);
        })
        .catch((error) => {
          console.error("Error fetching destinations:", error);
        });
    },

    loadUserInterests: function (userId) {
      fetch(`http://localhost:8080/users/${userId}/interests`)
        .then((response) => response.json())
        .then((interests) => {
          console.log("User Interests:", interests);
        })
        .catch((error) => {
          console.error("Error fetching interests:", error);
        });
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
    displayLogin: function () {
      var newUserHomePage = document.getElementById("new-user-inputs");
      newUserHomePage.style = "display:none";
      var returningUserHomePage = document.getElementById(
        "returning-user-inputs"
      );
      returningUserHomePage.style = "display:grid";
    },
  },

  // IDs and classes only meant for css purposes shouldn't have to query them for js or for automated behaviour tests
  // created is a function that gets called once when it loads
  // this is like self in python. this.data_attribute or this.method_name
  // v-on establishes an event listener its a directive, data binding, rendering
  created: function () {
    console.log("Hello, vue.");
    this.loadUsersCollection();
  },
}).mount("#app");
