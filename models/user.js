const mongoose = require("mongoose");
const user = new mongoose.Schema({
    username:String,   //用户名
    password:String
});
module.exports = mongoose.model('user', user);