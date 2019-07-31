const express = require("express");
const app = express();
const bodyParser = require("body-parser"); //交互
const mongoose = require("mongoose"); //数据库
const filmListTable = require("../../models/film_list");
const fs = require("fs");
const multer = require("multer"); //express上传中间件

//添加影片
exports.addFilm = (req, res, next) => {

  if (req.body._id) {
    //修改
    filmListTable.update({ _id: req.body._id }, req.body, (err, data) => {
      if (err) console.log(err);
      res.json({
        code: 0,
        msg: "更新成功",
        data
      });
    });
  } else {
    //新增
    filmListTable.create(req.body, (err, data) => {
      if (err) console.log(err);
      res.json({
        code: 0,
        msg: "保存成功",
        data
      });
    });
  }
};

//影片图片上传
exports.upFilmPhoto = (req, res, next) => {
  
  let storage = multer.diskStorage({
    //设置上传后文件路径，uploads文件夹会自动创建。
    destination: function(req, file, cb) {
      let apiPath = req.route.path; //上传接口
      let oDate = new Date();
      let YM = oDate.getFullYear() + "-" + (oDate.getMonth() + 1);
      let getFileNam = fs.readdirSync("./uploads/film_photos/");
      
      if (getFileNam.indexOf(YM) == -1) {
        fs.mkdir("./uploads/film_photos/" + YM, function(err) {
          //创建文件夹
          if (err) return console.error(err);
          cb(null, "./uploads/film_photos/" + YM); //图片存放路径
        });
      } else {
        cb(null, "./uploads/film_photos/" + YM); //图片存放路径
      }
    },
    //给上传文件重命名，获取添加后缀名
    filename: function(req, file, cb) {
      let fileFormat = file.originalname.split(".");
      
      cb(null, Date.now() + "." + fileFormat[fileFormat.length - 1]); //文件名为时间戳
    }
  });
  //添加配置文件到muler对象。
  let upload = multer({
    storage: storage
  }).single("file");

  upload(req, res, function(err) {
    if (err) return console.error(err);
    let upPath = req.file.path.replace(/\\\+/g, "/");
    res.json({
      code: 0,
      msg: "上传成功",
      data: {
        imgUrl: `${process.env.BASE_URL}/${upPath}`
      }
    });
  });
};

//获取影片列表
exports.getFilmList = async (req, res, next) => {
  let { film_name, release_date, page = 1, page_size = 10 } = req.body;
  let getCond = {};
  let condArr = [];

  if (film_name) {
    condArr.push({ film_name: { $regex: film_name } });
  }

  if (release_date && !!release_date.length) {
    condArr.push({
      $and: [
        { release_date: { $gte: release_date[0] } },
        { release_date: { $lte: release_date[1] } }
      ]
    });
  }

  let n = (Number(page)-1)*page_size;
  let numAdventures = await filmListTable.estimatedDocumentCount({},(err,length)=>{
      return length;
  });

  if (!!condArr.length) {
    //有条件
    getCond = { $and: condArr };
  }

  filmListTable.find(getCond).skip(n).limit(Number(page_size)).sort({ _id: -1 }).exec((err, data) => {
    if (err) return console.log(err);
    if(!!condArr.length){
        numAdventures = data.length;
    }
    if (data.length == 0) {
      res.json({
        code: 1,
        msg: "暂无数据",
        data:{
          film:data,
          total:numAdventures
        }
      });
    } else {
      res.json({
        code: 0,
        msg: "获取成功",
        data:{
          film:data,
          total:numAdventures
        }
      });
    }
  });
};

//获取影片详情
exports.getFilmDetail = (req, res, next) => {
  filmListTable.findOne(req.query, (err, data) => {
    if (data.length == 0) {
      res.json({
        code: 1,
        msg: "暂无数据",
        data
      });
    } else {
      res.json({
        code: 0,
        msg: "获取成功",
        data
      });
    }
  });
};

//删除影片
exports.delFilm = (req, res, next) => {
  filmListTable.remove(req.body, (err, data) => {
    res.json({
      code: 0,
      msg: "删除成功",
      data
    });
  });
};
