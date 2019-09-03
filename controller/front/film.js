const cinemaListTable = require("../../models/cinema_list");
const sessionListTable = require("../../models/session_list");
const seatListTable = require("../../models/seat_list");
const ticketsListTable = require("../../models/tickets_list");
const userListTable = require("../../models/user");
let { stampToTime, getDistance } = require("../../utils/index");
let { parseToken } = require("../../utils/token");
const session = require('express-session')
const SEAT_STATUS = [0, 1, 2, 3, 4]; //（0 可售、1 已售、2 锁定、3 不可售、4 已选）
const ORDER_STATUS = [0, 1, 2, 3]; //（0未支付、1已支付、2已退款、3已关闭）

//获取城市列表
exports.getCityList = (req, res, next) => {
  cinemaListTable.find({}, "province city lat_lng", (err, data) => {
    if (err) return console.log(err);
    res.json({
      code: 0,
      msg: "获取成功",
      data: data
    });
  });
};

//获取影院列表
exports.getCinemaList = async (req, res, next) => {
  let { lat, lng, city } = req.query;
  let getCinemaInfo = await cinemaListTable.find({$and:[
    {
      city: {
        $regex: city
      }
    },
    {
      status:true
    }
  ]});
  if (getCinemaInfo.length == 0) {
    res.json({
      code: 1,
      msg: "暂未开通影院"
    });
  } else {
    //计算距离后的影院
    let sortCinema = getCinemaInfo
      .map(v => {
        if(lat && lng){
          return {
            _id: v._id,
            cinema_name: v.cinema_name,
            address: v.address,
            serve_price: v.serve_price,
            stop_sale: v.stop_sale,
            status: v.status,
            province: v.province,
            city: v.city,
            lat: v.lat,
            lng: v.lng,
            dis: getDistance(lat, lng, v.lat, v.lng)
          };
        }else{
          return {
            _id: v._id,
            cinema_name: v.cinema_name,
            address: v.address,
            serve_price: v.serve_price,
            stop_sale: v.stop_sale,
            status: v.status,
            province: v.province,
            city: v.city,
            lat: v.lat,
            lng: v.lng,
            dis: null
          };
        }
      })
      .sort((a, b) => a.dis - b.dis);

    //查最低票价起
    let nowTime = stampToTime(Date.now() / 1000, "YMDhm");
    let getIds = getCinemaInfo.map(v => v._id);
    sessionListTable
      .find(
        { cinema_id: getIds, end_datetime: { $gt: nowTime }, status: 1 },
        "sell_price cinema_id"
      )
      .exec((err, data) => {
        let jsonPrice = {};

        data.forEach(v => {
          if (!jsonPrice[v.cinema_id]) {
            jsonPrice[v.cinema_id] = v.sell_price;
          } else {
            if (v.sell_price < jsonPrice[v.cinema_id]) {
              jsonPrice[v.cinema_id] = v.sell_price;
            }
          }
        });

        sortCinema.forEach(v => {
          for (let name in jsonPrice) {
            if (v._id == name) {
              v.min_price = jsonPrice[name];
            }
          }
        });

        res.json({
          code: 0,
          msg: "获取成功",
          data: {
            data: sortCinema
          }
        });

      });
  }
};

//首页获取当前学校排期
exports.getIndexFilmList = async (req, res, next) => {
  let { cinema_id } = req.query;
  let nowTime = stampToTime(Date.now() / 1000, "YMDhm");

  //获取影院
  let r =
    (await cinemaListTable.findOne(
      { $and:[
        { _id: cinema_id },
        { status: true }
      ] },
      "cinema_name address"
    )) || [];

  if (r.length == 0) {
    res.json({
      code: 2,
      msg: "暂无影院"
    });
    return;
  }

  await sessionListTable.find(
    { cinema_id, end_datetime: { $gt: nowTime }, status: 1 },
    (err, session) => {
      if (err) return console.log(err);

      if (session.length == 0) {
        res.json({
          code: 1,
          msg: "暂无数据",
          data: {
            session,
            info: r
          }
        });
      } else {
        session.sort((a, b) => a.start_datetime - b.start_datetime);
        res.json({
          code: 0,
          msg: "获取成功",
          data: {
            session,
            info: r
          }
        });
      }
    }
  );
};
//获取定位影院
exports.getLocationCollege = (req, res, next) => {
  let { lng, lat, city } = req.query;
  /**
   * 经纬度 : 距离
   * 维度0.0009:100米
   * 经度0.0012:100米
   * 允许定位范围半径1公里
   */
  let rightLongitude = 1 * lng + 0.012;
  let leftLongitude = 1 * lng - 0.012;
  let topLatitude = 1 * lat + 0.009;
  let bottomLatitude = 1 * lat - 0.009;

  cinemaListTable.find({ city: { $regex: city } }, (err, location) => {
    if (err) return console.log(err);

    if (!location) {
      res.json({
        code: 1,
        msg: "所在城市目前没有开通影院"
      });
    } else {
      let sortCinema = location
        .map(v => {
          return {
            _id: v._id,
            cinema_name: v.cinema_name,
            address: v.address,
            serve_price: v.serve_price,
            stop_sale: v.stop_sale,
            status: v.status,
            province: v.province,
            city: v.city,
            lat: v.lat,
            lng: v.lng,
            dis: getDistance(lat, lng, v.lat, v.lng)
          };
        })
        .sort((a, b) => a.dis - b.dis);
      res.json({
        code: 0,
        msg: "获取成功",
        data: sortCinema
      });
    }
  });
};

//获取座位信息
exports.getSeat = async (req, res, err) => {
  let { screen_id, _id } = req.query;
  let getToken = req.headers["x-token"];
  let { user_id, username } = parseToken(getToken, "b1234");
  const r = await sessionListTable.findOne(
    { _id },
    "film_name film_version start_datetime language",
    (err, data) => data
  );
  //查此影厅座位图
  await seatListTable.find(
    {
      $and: [{ screen_id }, { is_show: 1 }]
    },
    async (err, data) => {
      if (err) return console.log(err);
      /**
       * 1.查找此排期非自己下座位情况（即所售订单）
       * 2.查找次排期自己是否有占座情况（即未完成订单）
       * 3.返回座位情况
       */
      //1查此影厅排期座位状态
      const getUsedSeat = await ticketsListTable.find({ session_id: _id });

      data.forEach(v => {
        getUsedSeat.forEach(item => {
          if (v._id == item.seat_id) {
            if (item.seat_status == SEAT_STATUS[2]) {
              item.user_id == user_id
                ? (v.seat_status = SEAT_STATUS[4])
                : (v.seat_status = item.seat_status);
            } else {
              v.seat_status = item.seat_status;
            }
          }
        });
      });

      res.json({
        code: 0,
        msg: "获取成功",
        data: {
          seat: data,
          film_info: r
          //mySeat:myUsedSeat
        }
      });
    }
  );
};
