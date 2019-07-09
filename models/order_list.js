const mongoose = require("mongoose");
const orderList = new mongoose.Schema({
    user_id:String, //用户id
    order_num:String,   //订单号
    seat:Array,    //座位
    seat_id:Array,
    order_datetime:String, //下单日期
    pay_datetime:{
        default:null,
        type:String
    },   //支付日期
    status:Number,   //状态 （0未支付 1已支付 2已退款  3已关闭）
    sell_price:Number, //票价
    serve_price:Number, //服务费
    total_price:Number, //总价
    pay_price:Number,   //支付价 （含服务费）
    film_name:String,   //影片名称
    film_version:String,
    start_datetime:String,    //开场日期时间
    end_datetime:String,     //结束日期时间
    screen_name:String,  //影厅名称
    cinema_name:String,  //影厅名称
    film_photo:String,  //影片海报
    language:String,    //语言
    QR:{    //取票二维码
        type:String,
        default:null
    }  
    
});
module.exports = mongoose.model('orderList', orderList);