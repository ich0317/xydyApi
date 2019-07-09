const express = require('express');
const app = express();
const cinemaListTable = require("../../models/cinema_list");
const sessionListTable = require("../../models/session_list");
const seatListTable = require("../../models/seat_list");
const orderListTable = require("../../models/order_list");
let { stampToTime } = require('../../utils/index');
const SEAT_STATUS = [0, 1, 2, 3, 4]; //（0 可售、1 已售、2 锁定、3 不可售、4 已选）

//获取城市列表
exports.getCityList = (req, res, next) => {
  cinemaListTable.find({}, 'province city lat_lng', (err, data) => {
    if (err) return console.log(err);
    res.json({
      code: 0,
      msg: "获取成功",
      data: data
    });
  });
}

//获取影院列表
exports.getCinemaList = (req, res, next) => {

  cinemaListTable.find({
    city: {
      $regex: req.query.city
    }
  }, (err, data) => {
    if (err) return console.log(err);

    if (data.length == 0) {
      res.json({
        code: 1,
        msg: "暂未开通影院",
        data: data
      });
    } else {
      res.json({
        code: 0,
        msg: "获取成功",
        data: data
      });
    }
  });
};

//首页获取当前学校排期
exports.getIndexFilmList = async (req, res, next) => {
  let { cinema_id } = req.query;
  let nowTime = stampToTime(Date.now() / 1000, 'YMDhm');

  //获取影院
  let r = await cinemaListTable.findOne({ _id: cinema_id }, 'cinema_name address') || [];

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
//获取定位学校
exports.getLocationCollege = (req, res, next) => {
  let { lng, lat } = req.query;
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

  cinemaListTable.findOne(
    {
      $and: [
        { lng: { $lt: rightLongitude } },
        { lng: { $gt: leftLongitude } },
        { lat: { $lt: topLatitude } },
        { lat: { $gt: bottomLatitude } }
      ]
    },
    (err, location) => {
      if (err) return console.log(err);
     
      if (!location) {
        res.json({
          code: 1,
          msg: "没有定位到附近学校",
          data: [lat,lng]
        });
      } else {
        // let arr = [];
        // location.forEach((v,i)=>{
        //   let newLat = 1*v.lat - 1*lat;
        //   let newLng = 1*v.lng - 1*lng;
        //   arr.push({[i]:Math.sqrt(newLat*newLat+newLng*newLng)});
        // })
    
        res.json({
          code: 0,
          msg: "获取成功",
          data: location
        });
      }
    }
  );
};

//获取座位信息
exports.getSeat = async (req, res, err) => {
  let { screen_id, _id } = req.query;
  const r = await sessionListTable.findOne({ _id }, 'film_name film_version start_datetime language' ,(err, data) => data);
  await seatListTable.find({
    $and: [
      { screen_id },
      { is_show: 1 }
    ]
  },async (err, data) => {
    if (err) return console.log(err);

    const getUsedSeat = await orderListTable.find({session_id:_id});
    let usedSeat = null;
    let myUsedSeat =null;
    let userId = global.piaoUserId || '';
 
    getUsedSeat.forEach(v=>{
      if(v.user_id == userId){
        //用户自己看的座位
        myUsedSeat = [].concat(v.seat_id);
      }else{
        //其他用户看的座位
        usedSeat = [].concat(v.seat_id);
      } 
    })

    if(usedSeat){
      data.filter(v=>{
        if(usedSeat.includes((v._id+''))){
          v.seat_status = SEAT_STATUS[2];
        }
      })
    }
    if(myUsedSeat){
      data.filter(v=>{
        if(myUsedSeat.includes((v._id+''))){
          v.seat_status = SEAT_STATUS[4];
        }
      })
    }

    res.json({
      code: 0,
      msg: "获取成功",
      data: {
        seat:data,
        film_info:r,
        mySeat:myUsedSeat
      }
    });
  })
}








