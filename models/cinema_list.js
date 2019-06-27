const mongoose = require("mongoose");
const cinemaList = new mongoose.Schema({
    cinema_name:String,   //影院名称 
    province:String,
    city:String,
    address:String,
    serve_price:Number,
    stop_sale:Number,
    lat_lng:String,    //维度和精度
    status:Boolean, //影院状态
});
module.exports = mongoose.model('cinemaList', cinemaList);