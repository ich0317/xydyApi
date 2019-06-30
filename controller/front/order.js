const seatListTable = require("../../models/seat_list");
const sessionListTable = require("../../models/session_list");
const orderListTable = require("../../models/order_list");
const cinemaListTable = require("../../models/cinema_list");
let { stampToTime } = require('../../utils/index');

const SEAT_STATUS = [0, 1, 2, 3, 4]; //（0 可售、1 已售、2 锁定、3 不可售、4 已选）
const SESSION_STATUS = [0, 1, 2, 3];  //状态 （0未审核 1已审核 2禁售 3完场）
const ORDER_STATUS = [0, 1, 2, 3];  //（0未支付 1已支付 2已退款  3已关闭）
//下单
exports.placeOrder = async (req, res, next) => {
  let { session_id, seat_id } = req.body;
  const isSeatUse = await seatListTable.find({ _id: seat_id, seat_status: SEAT_STATUS[0] }, (err, data) => data);
  if (!isSeatUse && seat_id.length != isSeatUse.length) {
    res.json({
      code: -1,
      msg: "部分座位已售出",
      data: isSeatUse
    });
    return;
  }

  //创建订单
  let nowDate = stampToTime(Date.now(), 'YMDhms').replace(/-|\s|:/g, '');
  let orderNum = nowDate;
  //获取影片信息
  const sessionRes = await sessionListTable.findOne({ _id: session_id, status: SESSION_STATUS[1] }, 'film_name film_photo language film_version sell_price cinema_id screen_name start_datetime end_datetime', (err, data) => data);
  //获取影院服务费
  const { serve_price } = await cinemaListTable.findOne({ _id: sessionRes.cinema_id }, 'serve_price', (err, data) => data);

  if (!sessionRes._id) {
    res.json({
      code: -1,
      msg: "场次异常"
    });
    return;
  }
  let seat = '';
  isSeatUse.forEach(v => {
    seat += `${v.seat_row}排${v.seat_col}坐,`;
  })

  await orderListTable.create({
    film_name:sessionRes.film_name,
    order_num: orderNum,
    session_id: sessionRes._id,
    seat_num: seat,
    sell_price:sessionRes.sell_price,
    serve_price,
    order_datetime: stampToTime(Date.now(), 'YMDhms'),
    pay_datetime: null,
    status: ORDER_STATUS[0]
  }, (err, data) => {
    res.json({
      code: 0,
      msg: "下单成功",
      data: {
        film_info:sessionRes,
        order_info:data
      }
    });
  })
}
