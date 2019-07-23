const orderListTable = require("../../models/order_list");
let { parseToken } = require("../../utils/token");
const ORDER_STATUS = [0, 1, 2, 3]; //（0未支付 1已支付 2已退款  3已关闭）
//获取my信息
exports.myInfo = (req, res, next) => {
  let getToken = req.headers["x-token"];
  if(getToken){
    let { user_id, username } = parseToken(getToken, "b1234");
    orderListTable.find({ user_id, status: ORDER_STATUS[0] }, (err, data) => {
      res.json({
        code: 0,
        msg: "获取成功",
        data: {
          unpay: data.length
        }
      });
    });
  }else{
    res.json({
      code: 0,
      msg: "获取成功",
      data: {
        unpay: 0
      }
    });
  }
};
