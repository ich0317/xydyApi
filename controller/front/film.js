const express = require('express');
const app = express();
const collegeListTable = require("../../models/college_list");
const cinemaListTable = require("../../models/cinema_list");
const sessionListTable = require("../../models/session_list");
let { stampToTime } = require('../../utils/index');


//获取学校列表
exports.getCollegeList = (req, res, next) => {
  let {college_name} = req.query;
    college_name = college_name ? {'college_name': {'$regex': college_name}} : {};
    collegeListTable.find( college_name, (err, college) => {
        if (err) return console.log(err);
        res.json({
          code: 0,
          msg: "获取成功",
          data: college
        });
    });
}

//获取影院列表
exports.getCinemaList = (req, res, next) => {
  let findCondi = null;
  
  if(req.query.cinema_name){
    findCondi = {'cinema_name': {'$regex': req.query.cinema_name}};
  }else{
    findCondi = req.query.college_id ? {college_id : req.query.college_id} : {};
  }

  cinemaListTable.find(findCondi, (err, data) => {
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
  let nowTime = stampToTime(Date.now() / 1000,'YMDhm');
  
  //获取影院
  let r = await cinemaListTable.find({ _id: cinema_id });
  if(r.length == 0){
    res.json({
      code: 2,
      msg: "暂无影院"
    });
    return;
  }
  //获取学校
  let rr = await collegeListTable.find({ _id: r[0].college_id });
  
  await sessionListTable.find(
    { cinema_id, end_datetime: { $gt: nowTime }, status:1 },
    (err, session) => {
      if (err) return console.log(err);
      
      if (session.length == 0) {
        res.json({
          code: 1,
          msg: "暂无数据",
          data: {
            college_name: rr[0].college_name,
            address: rr[0].address,
            cinema_name: r[0].cinema_name
          }
        });
      } else {
        session.sort((a, b) => a.start_datetime - b.start_datetime);
        res.json({
          code: 0,
          msg: "获取成功",
          data: {
            session,
            college_name: rr[0].college_name,
            address: rr[0].address,
            cinema_name: r[0].cinema_name
          }
        });
      }
    }
  );
};
//获取定位学校
exports.getLocationCollege = (req, res, next) => {
  let { longitude, latitude } = req.query;
  /**
   * 经纬度 : 距离
   * 维度0.0009:100米
   * 经度0.0012:100米
   * 允许定位范围半径1公里
   */
  let rightLongitude = 1 * longitude + 0.012;
  let leftLongitude = 1 * longitude - 0.012;
  let topLatitude = 1 * latitude + 0.009;
  let bottomLatitude = 1 * latitude - 0.009;

  collegeListTable.find(
    {
      $and: [
        { longitude: { $lt: rightLongitude } },
        { longitude: { $gt: leftLongitude } },
        { latitude: { $lt: topLatitude } },
        { latitude: { $gt: bottomLatitude } }
      ]
    },
    (err, location) => {
      if (err) return console.log(err);
      if (location.length == 0) {
        res.json({
          code: 1,
          msg: "没有定位到附近学校",
          data: location
        });
      } else {
        res.json({
          code: 0,
          msg: "获取成功",
          data: location
        });
      }
    }
  );
};











