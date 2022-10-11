const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: [true, "Please provide a name!"],
        unique: false,
    },

    lastName: {
        type: String,
        required: [true, "Please provide a surname!"],
        unique: false,
    },

    username: {
        type: String,
        required: [true, "Please provide a username!"],
        unique: [true, "Username Exist"]
    },

    email: {
        type: String,
        required: [true, "Please provide an Email!"],
        unique: [true, "Email Exist"],
    },

    password: {
        type: String,
        required: [true, "Please provide a password!"],
        unique: false,
    },
})

module.exports = mongoose.model.Users || mongoose.model("Users", UserSchema);
