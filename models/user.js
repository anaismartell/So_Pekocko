const mongoose = require('mongoose'); 
const uniqueValidator = require("mongoose-unique-validator"); // rajoute le package mongoose unique validator comme plugin au schéma

const userSchema = mongoose.Schema({
    email: {type: String, required: true, unique: true}, 
    password: { type: String, required: true} 
});

userSchema.plugin(uniqueValidator); // éviter que plusieurs users utilisent la même adresse mail

module.exports = mongoose.model("User", userSchema);
