const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

mongoose.connect(
  "mongodb+srv://anjolie-4200:6fKEM2Twx6YsxGtp@atlascluster.qslnfwu.mongodb.net/users?retryWrites=true&w=majority"
);

const usersSchema = new mongoose.Schema({
  name: { type: String, required: true, minlength: 2, maxlength: 15 },
  birthday: String,
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: function (v) {
        return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(v);
      },
      message: (props) => `${props.value} is not a valid email address!`,
    },
  },
  password: { type: String, required: true, minlength: 8 },
  encryptedPassword: String,
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  destinations: Array,
  interests: Array,
  toJSON: {
    //modifying the data that gets presented so you don't show encrypted passwords
    versionKey: false,
    transform: function (doc, ret) {
      delete ret.encryptedPassword;
    },
  },
});

//encrypt given plain password and store into model instance
usersSchema.methods.setEncryptedPassword = function (plainPassword) {
  var promise = new Promise((resolve, reject) => {
    //resolve is then()
    //reject is catch()
    bcrypt.hash(plainPassword, 12).then((hash) => {
      //set the encryptedPassword value on the model instance
      this.encryptedPassword = hash;
      //resolve this promise, eventually...
      resolve(); //this invokes the caller's then() function
    });
  });
  return promise;
};
//verify an attempted password compared to store encrypted password
usersSchema.methods.verifyEncryptedPassword = function (plainPassword) {
  var promise = new Promise((resolve, reject) => {
    console.log("plainPassword", plainPassword);
    console.log("this.encryptedPassword", this.encryptedPassword);
    bcrypt.compare(plainPassword, this.encryptedPassword).then((result) => {
      resolve(result);
    });
    console.log(plainPassword);
  });
  return promise;
};

const User = mongoose.model("User", usersSchema);

module.exports = {
  User: User,
};
