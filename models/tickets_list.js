const mongoose = require("mongoose");
const tickets_list = new mongoose.Schema({
    order_id:String,     //订单id
    seat:String, //座位
    seat_id:String,  //座位id
    tickets_status:Number  // 0已退 1已售
});
module.exports = mongoose.model('tickets_list', tickets_list);