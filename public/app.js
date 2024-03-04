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
      destinations: [],
      interests: [],
      currentUser: {
        name: "",
        birthday: "",
        email: "",
        password: "",
      },
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
      return;
    },

    isNewUserValid: function () {
      this.errorMessages = {};
      if (this.newUserName == undefined || this.newUserName == "") {
        this.errorMessages["user.name"] = "Name is required.";
      }

      let birthDate = new Date(this.newUserBirthday);
      if (birthDate == "Invalid Date") {
        this.errorMessages["user.birthday"] = "Birthday is invalid.";
      } else {
        this.newUserBirthday = birthDate.toISOString().split("T")[0];
      }

      if (!this.isEmailValid(this.newUserEmail)) {
        this.errorMessages["user.email"] = "Email is invalid.";
      }

      if (
        this.newUserPassword == undefined ||
        this.newUserPassword.length < 8
      ) {
        this.errorMessages["user.password"] =
          "Password must be at least 8 characters.";
      }

      console.log(Object.keys(this.errorMessages).length);

      return Object.keys(this.errorMessages).length == 0;
    },

    addUser: function () {
      if (!this.isNewUserValid()) return;
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
      fetch("/users", requestOptions).then((response) => {
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
      var data = "email=" + encodeURIComponent(this.returningUserEmail);
      data += "&password=" + encodeURIComponent(this.returningUserPassword);
      console.log("data: ", data);
      requestOptions = {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: data,
      };
      fetch("/login", requestOptions)
        .then((response) => {
          if (response.status === 200) {
            response.json().then((data) => {
              console.log("User ID:", data.userId);
              localStorage.setItem("userId", data.userId);
              fetch(`/users/${data.userId}/destinations`)
                .then((response) => response.json())
                .then((destinations) => {
                  this.destinations = destinations;
                });
              fetch(`/users/${data.userId}/interests`)
                .then((response) => response.json())
                .then((interests) => {
                  this.interests = interests;
                });
            });
            (this.currentUser = {
              name: "",
              birthday: "",
              email: "",
              password: "",
            }),
              this.loadUserInfo();
            this.displayHomePage();
          } else {
            this.errorMessages.login = "Invalid email or password";
          }
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    },

    isEmailValid: function (email) {
      return String(email)
        .toLowerCase()
        .match(
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        );
    },

    loadUsersCollection: function () {
      fetch("/users").then((response) => {
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
      fetch(`/users/${userId}/destinations`)
        .then((response) => response.json())
        .then((destinations) => {
          console.log("User Destinations:", destinations);
        })
        .catch((error) => {
          console.error("Error fetching destinations:", error);
        });
    },

    loadUserInterests: function (userId) {
      fetch(`/users/${userId}/interests`)
        .then((response) => response.json())
        .then((interests) => {
          console.log("User Interests:", interests);
        })
        .catch((error) => {
          console.error("Error fetching interests:", error);
        });
    },

    addDestination: function () {
      const userId = localStorage.getItem("userId");
      if (!userId) {
        console.error("User ID not found in local storage");
        return;
      }
      const data = "destination=" + encodeURIComponent(this.newDestination);
      const requestOptions = {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: data,
      };
      fetch(`/users/${userId}/destinations`, requestOptions)
        .then((response) => {
          if (response.status === 201) {
            console.log("Destination added successfully");
            this.loadUserDestinations(userId);
            fetch(`/users/${userId}/destinations`)
              .then((response) => response.json())
              .then((destinations) => {
                this.destinations = destinations;
              });
          } else {
            console.error("Failed to add destination:", response.statusText);
          }
        })
        .catch((error) => {
          console.error("Error adding destination:", error);
        });
    },

    removeDestination: function (destination) {
      const userId = localStorage.getItem("userId");
      if (!userId) {
        console.error("User ID not found in local storage");
        return;
      }
      const requestOptions = {
        method: "DELETE",
      };
      fetch(
        `http://localhost:8080/users/${userId}/destinations/${destination}`,
        requestOptions
      )
        .then((response) => {
          if (response.status === 204) {
            console.log("Destination removed successfully");
            this.loadUserDestinations(userId);
            fetch(`http://localhost:8080/users/${userId}/destinations`)
              .then((response) => response.json())
              .then((destinations) => {
                this.destinations = destinations;
              });
          } else {
            console.error("Failed to remove destination:", response.statusText);
          }
        })
        .catch((error) => {
          console.error("Error removing destination:", error);
        });
    },

    addInterest: function () {
      const userId = localStorage.getItem("userId");
      if (!userId) {
        console.error("User ID not found in local storage");
        return;
      }
      const data = "interest=" + encodeURIComponent(this.newInterest);
      const requestOptions = {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: data,
      };
      fetch(`/users/${userId}/interests`, requestOptions)
        .then((response) => {
          if (response.status === 201) {
            console.log("Interest added successfully");
            this.loadUserInterests(userId);
            fetch(`/users/${userId}/interests`)
              .then((response) => response.json())
              .then((interests) => {
                this.interests = interests;
              });
          } else {
            console.error("Failed to add interest:", response.statusText);
          }
        })
        .catch((error) => {
          console.error("Error adding interest:", error);
        });
    },

    loadUserInfo: function () {
      const userId = localStorage.getItem("userId");
      if (!userId) {
        console.error("User ID not found in local storage");
        return;
      }
      fetch(`/users/${userId}`)
        .then((response) => response.json())
        .then((userInfo) => {
          this.currentUser.name = userInfo.name;
          this.currentUser.birthday = userInfo.birthday;
          this.currentUser.email = userInfo.email;
          this.currentUser.password = userInfo.password;
        })
        .catch((error) => {
          console.error("Error loading user info:", error);
        });
    },

    // remove an interest for a user
    removeInterest: function (interest) {
      const userId = localStorage.getItem("userId");
      if (!userId) {
        console.error("User ID not found in local storage");
        return;
      }
      const requestOptions = {
        method: "DELETE",
      };
      fetch(`/users/${userId}/interests/${interest}`, requestOptions)
        .then((response) => {
          if (response.status === 204) {
            console.log("Interest removed successfully");
            this.loadUserInterests(userId);
            fetch(`/users/${userId}/interests`)
              .then((response) => response.json())
              .then((interests) => {
                this.interests = interests;
              });
          } else {
            console.error("Failed to remove interest:", response.statusText);
          }
        })
        .catch((error) => {
          console.error("Error removing interest:", error);
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

    displayHomePage: function () {
      var returningUserHomePage = document.getElementById("LoginBox");
      returningUserHomePage.style = "display:none";
      var homePage = document.getElementById("homePage");
      homePage.style = "display:grid";
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

  computed: {
    validationErrors: function () {
      return Object.keys(this.errorMessages).length > 0;
    },
  },

  // IDs and classes only meant for css purposes shouldn't have to query them for js or for automated behaviour tests
  // created is a function that gets called once when it loads
  // this is like self in python. this.data_attribute or this.method_name
  // v-on establishes an event listener its a directive, data binding, rendering
  created: function () {
    console.log("Hello, vue.");
  },
}).mount("#app");
