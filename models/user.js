const mongoose = require("mongoose");
const user = new mongoose.Schema({
    username:String,   //用户名
    password:String,
    user_pos:Array,     //用户坐标
    user_location:String    //用户所在地
});
module.exports = mongoose.model('user', user);