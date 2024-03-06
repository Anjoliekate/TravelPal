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
      errorMessages: {},
      newUserName: "",
      newUserBirthday: "",
      newUserEmail: "",
      newUserPassword: "",
      newDestination: "",
      newInterest: "",
      returningUserEmail: "",
      returningUserPassword: "",
      userInfo: {},
      userInfoName: "",
      userInfoBirthday: "",
      userInfoEmail: "",
    };
  },

  // object with more keys inside it.
  methods: {
    loadUserInfo: function () {
      const userId = localStorage.getItem("userId");
      if (!userId) {
        console.error("User ID not found in local storage");
        return;
      }
      fetch(`/users/${userId}`)
        .then((response) => response.json())
        .then((userData) => {
          console.log("User Info:", userData);
          // Update user info in Vue data
          this.userInfo = userData;
        })
        .catch((error) => {
          console.error("Error fetching user info:", error);
        });
    },

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
      return Object.keys(this.errorMessages).length == 0;
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
      if (!this.validateReturningUserInputs()) return;
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
              this.loadUserInfo();
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

    displayInput: function () {
      const userId = localStorage.getItem("userId");
      if (!userId) {
        console.error("User ID not found in local storage");
        return;
      }
      var newUserHomePage = document.getElementById("user-info");
      newUserHomePage.style = "display:none";
      var returningUserHomePage = document.getElementById("edit-info");
      returningUserHomePage.style = "display:grid";
      fetch(`/users/${userId}`)
        .then((response) => response.json())
        .then((userData) => {
          console.log("User Info:", userData);
          this.userInfo = userData;
          this.userInfoName = this.userInfo.name;
          this.userInfoBirthday = this.userInfo.birthday;
          this.userInfoEmail = this.userInfo.email;

          document.getElementById("nameInput").value = this.userInfoName;
          document.getElementById("birthdayInput").value =
            this.userInfoBirthday;
          document.getElementById("emailInput").value = this.userInfoEmail;
        });
    },

    updateUserInformation: function () {
      const userId = localStorage.getItem("userId");
      if (!userId) {
        console.error("User ID not found in local storage");
        return;
      }
      const userData = {
        name: this.userInfoName,
        birthday: this.userInfoBirthday,
        email: this.userInfoEmail,
      };
      console.log("userData: ", userData);
      fetch(`/users/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      })
        .then((response) => {
          if (response.ok) {
            console.log("User information updated successfully");
            this.userInfo.name = userData.name;
            this.userInfo.birthday = userData.birthday;
            this.userInfo.email = userData.email;

            this.userInfoName = "";
            this.userInfoBirthday = "";
            this.userInfoEmail = "";

            var newUserHomePage = document.getElementById("edit-info");
            newUserHomePage.style = "display:none";
            var returningUserHomePage = document.getElementById("user-info");
            returningUserHomePage.style = "display:grid";
          } else {
            console.error(
              "Failed to update user information:",
              response.statusText
            );
          }
        })
        .catch((error) => {
          console.error("Error updating user information:", error);
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
                this.newDestination = "";
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
      if (confirm("Are you sure you want to remove this destination?")) {
        const userId = localStorage.getItem("userId");
        if (!userId) {
          console.error("User ID not found in local storage");
          return;
        }
        const requestOptions = {
          method: "DELETE",
        };
        fetch(`/users/${userId}/destinations/${destination}`, requestOptions)
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
              console.error(
                "Failed to remove destination:",
                response.statusText
              );
            }
          })
          .catch((error) => {
            console.error("Error removing destination:", error);
          });
      }
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
                this.newInterest = "";
              });
          } else {
            console.error("Failed to add interest:", response.statusText);
          }
        })
        .catch((error) => {
          console.error("Error adding interest:", error);
        });
    },

    // remove an interest for a user
    removeInterest: function (interest) {
      if (confirm("Are you sure you want to remove this interest?")) {
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
      }
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
      errorMessages = {};
      var newUserHomePage = document.getElementById("new-user-inputs");
      newUserHomePage.style = "display:none";
      var returningUserHomePage = document.getElementById(
        "returning-user-inputs"
      );
      returningUserHomePage.style = "display:grid";
      this.returningUserEmail = "";
      this.returningUserPassword = "";
    },

    signOut: function () {
      var homePage = document.getElementById("homePage");
      homePage.style = "display:none";
      var newUserHomePage = document.getElementById("new-user-inputs");
      newUserHomePage.style = "display: grid";
      var returningUserHomePage = document.getElementById(
        "returning-user-inputs"
      );
      returningUserHomePage.style = "display:none";
      var returningUserHomePage = document.getElementById("LoginBox");
      returningUserHomePage.style = "display:inline-flex";

      this.newUserPassword = "";
      this.newUserEmail = "";
      this.newUserName = "";
      this.newUserBirthday = "";
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
    this.loadUserInfo();
  },
}).mount("#app");
