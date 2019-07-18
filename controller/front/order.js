const seatListTable = require("../../models/seat_list");
const sessionListTable = require("../../models/session_list");
const orderListTable = require("../../models/order_list");
const cinemaListTable = require("../../models/cinema_list");
const ticketsListTable = require("../../models/tickets_list");
let { stampToTime, timeToStamp } = require('../../utils/index');
let { parseToken } = require('../../utils/token');
let qr = require('qr-image')

const SEAT_STATUS = [0, 1, 2, 3, 4]; //（0 可售、1 已售、2 锁定、3 不可售、4 已选）
const SESSION_STATUS = [0, 1, 2, 3];  //状态 （0未审核 1已审核 2禁售 3完场）
const ORDER_STATUS = [0, 1, 2, 3];  //（0未支付 1已支付 2已退款  3已关闭）

//下单
exports.placeOrder = async (req, res, next) => {
  let { session_id, seat_id } = req.body;
  //let userId = global.piaoUserId || '';
  let getToken = req.headers['x-token'];
  let {user_id, username} = parseToken(getToken,'b1234');
  /**
   * 下单流程
   * 1.查找此用户是否有未完成订单 
   * 2.查找座位是否可用
   * 3.查找影片信息
   * 4.查找影院服务费
   * 5.生成新订单
   * find 数据无法修改           
   */
  
  //1
  const findOrder = await orderListTable.findOne({ user_id,status:ORDER_STATUS[0] }, (err, data) => data);
  //2
  let findSeat = await orderListTable.find({
    session_id,
    $nor: [
      { user_id }
    ]
  }, async (err, data) => {
    let seatArr;
    let used = 0;
    //座位是否可用
    if (data.length != 0) {
      data.forEach(v => {
        seatArr = [].concat(v.seat_id);
      })
      seat_id.forEach(v => {
        if (seatArr.includes(v)) {
          used++
        }
      })
    }

    if (used == 0) {
      //座位可用
      //3
      let findFilmInfo = await sessionListTable.findOne({ _id: session_id }, 'film_name film_version start_datetime end_datetime screen_name cinema_id screen_id film_photo language sell_price', (err, data) => data);
      //4
      const findServePrice = await cinemaListTable.findOne({ _id: findFilmInfo.cinema_id }, 'cinema_name serve_price', (err, data) => data);
      //座位id找相应座位号
      let seat = [];
      const findSetInfo = await seatListTable.find({ screen_id: findFilmInfo.screen_id, _id: seat_id })
      findSetInfo.forEach(v => {
        seat.push(`${v.seat_row}排${v.seat_col}座`);
      });

      findFilmInfo = Object.assign({}, findFilmInfo)._doc;
      delete findFilmInfo._id;
      let serve_price = findServePrice.serve_price;
      let total_price = findFilmInfo.sell_price * seat_id.length;
      let pay_price = total_price + serve_price * seat_id.length;

      //5
      let createInfo = {
          username,
          user_id, //用户id
          order_num: Date.now(),   //订单号
          session_id,
          seat,    //座位
          seat_id,
          serve_price, //服务费
          total_price,
          pay_price,
          cinema_name: findServePrice.cinema_name,
          order_datetime: stampToTime(Date.now(), 'YMDhms'), //下单日期
          pay_datetime: '',   //支付日期
          status: ORDER_STATUS[0],  //状态 （0未支付 1已支付 2已退款  3已关闭）
          ...findFilmInfo
      };
    
      if (findOrder) {
        //修改订单
        orderListTable.updateOne({ _id: findOrder._id }, createInfo, (err, data) => {
          res.json({
            code: 0,
            msg: '修改订单成功',
            data: {
              order_id: findOrder._id
            }
          })
        })
      } else {
        //创建订单
        orderListTable.create(createInfo, (err, data) => {
          res.json({
            code: 0,
            msg: '创建订单成功',
            data: {
              order_id: data._id
            }
          })
        })
      }

    } else {
      //部分座位不可用
      res.json({
        code: -1,
        msg: '部分座位已售出',
        data
      })
    }
  });

}
//获取订单详情
exports.orderDetail = (req, res, next) => {
  let {order_id} = req.query;
  
  orderListTable.findOne({_id:order_id},(err,data)=>{
    
    if(data){
      res.json({
        code: 0,
        msg: '获取成功',
        data:{...{...data}._doc, server_datetime:Date.now()}
      })
    }else{
      res.json({
        code: 1,
        msg: '订单不存在',
        data
      })
    }
    
  });
}

//取消订单
exports.cancelOrder = (req, res, next) => {
  let { order_id } = req.body;
  orderListTable.deleteOne({_id:order_id},(err,data)=>{
    res.json({
      code: 0,
      msg: '取消成功',
      data
    })
  });
}
//支付订单
exports.payOrder = (req, res, next) => {
  let {order_id} = req.body;
  let codeStr = qr.imageSync( order_id ,{ type: 'png',size:8,margin:0});
  let base64QR='data:image/jpeg;base64,'+ codeStr.toString('base64');
  orderListTable.updateOne({_id:order_id},{status:ORDER_STATUS[1],pay_datetime:stampToTime(Date.now(), 'YMDhms'),QR:base64QR},(err,data)=>{
    res.json({
      code: 0,
      msg: '支付成功',
      data:{
        ...{...data}._doc,
        QR:base64QR
      }
    })
  })
}
//定时任务结束超过10分钟未支付订单
let timer = setInterval(()=>{
  orderListTable.find({status:ORDER_STATUS[0]},(err,data)=>{
    //if(data.length == 0)clearInterval(timer);
    let serverTime = Date.now() / 1000;
    let expireOrder = data.map(v=>{
      let placeOrderTime = parseInt(timeToStamp(v.order_datetime) / 1000) + 600;
      return serverTime - placeOrderTime > 0 && {_id:v._id};
    })
    if(expireOrder.length != 0){
      orderListTable.deleteMany({_id:expireOrder},(err,data)=>{
        return console.log(data);
      });
    }
  })
},30000);

//获取订单列表
exports.getOrderList = (req, res, err)=>{
  let getToken = req.headers['x-token'];
  let {user_id, username} = parseToken(getToken,'b1234');
  orderListTable.find({user_id},'cinema_name film_name start_datetime seat status end_datetime').sort({_id:-1}).exec((err,data)=>{
    if(data.length == 0){
      res.json({
        code: 1,
        msg: '暂无订单'
      })
    }else{
      res.json({
        code: 0,
        msg: '获取成功',
        data:{
          list:data,
          server_datetime:Date.now() / 1000
        }
      })
    }
  })
}