const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  userId: {
    type: String,
    require: true,
    unique: true,
  },
  name: {
    type: String,
    require: true,
    unique: true,
  },
  //usn, branch, year, bio, so we can make a profiel for each of them (if it works)
});

const USER = mongoose.model("user", userSchema)

module.exports = USER;