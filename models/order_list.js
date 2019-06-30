const mongoose = require("mongoose");
const orderList = new mongoose.Schema({
    film_name:String,   //影片名称
    order_num:String,   //订单号
    session_id:String,  //影片海报
    seat_num:String,    //座位
    sell_price:Number, //票价
    serve_price:Number, //服务费
    order_datetime:String, //下单日期
    pay_datetime:String,   //支付日期
    status:Number   //状态 （0未支付 1已支付 2已退款  3已关闭）
});
module.exports = mongoose.model('orderList', orderList);