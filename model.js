const mongoose = require("mongoose");

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
  destinations: Array,
  interests: Array,
});

const User = mongoose.model("User", usersSchema);

module.exports = {
  User: User,
};
