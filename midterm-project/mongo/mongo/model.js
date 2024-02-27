const mongoose = require("mongoose");

mongoose.connect(
  "mongodb+srv://anjolie-4200:6fKEM2Twx6YsxGtp@atlascluster.qslnfwu.mongodb.net/users?retryWrites=true&w=majority"
);

// const usersSchema = new mongoose.Schema({
//   id: { type: Number, required: true },
//   name: { type: String, required: true },
//   birthday: { type: Number, required: true },
//   email: { type: String, required: true },
//   password: { type: String, required: true },
//   destinations: { type: Array, required: true },
//   interests: { type: Array, required: true },
// });

const User = mongoose.model("User", {
  name: String,
  birthday: String,
  email: String,
  password: String,
  destinations: Array,
  interests: Array,
});

const Destination = mongoose.model("Destination", {
  destinations: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
});

module.exports = {
  User: User,
  Destination: Destination,
};
