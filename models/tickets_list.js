const mongoose = require("mongoose");
const tickets_list = new mongoose.Schema({
  order_id: String, //订单id
  user_id: String,
  seat_id: String, //座位id
  session_id: String,
  seat: String, //座位
  ticket_code:String,   
  seat_status: Number, //（0 可售、1 已售、2 锁定、3 不可售、4 已选）
  refund_datetime: {
    //退票时间
    default: null,
    type: String
  },
  ticket_status: Number // 0未支付 1已支付 2已退  3已取  4已检
});
module.exports = mongoose.model("tickets_list", tickets_list);
