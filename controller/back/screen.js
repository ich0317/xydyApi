const express = require("express");
const app = express();
const screenListTable = require("../../models/screen_list");

//添加影厅
exports.addScreen = (req, res, next) => {
  let { _id } = req.body;
  if(_id){
    //修改
    filmListTable.find({film_name:{$regex:film_name}},(err,data)=>{
      if (err) return console.log(err);
      if(data.length == 0){
        res.json({
          code:1,
          msg:'暂无影片',
          data
        });
      }else{
        res.json({
          code:0,
          msg:'获取成功',
          data
        });
      }
    });
  }else{
    //新增
    screenListTable.create(req.body,(err,data)=>{
      if (err) return console.log(err);
      res.json({
        code:0,
        msg:'添加成功',
        data
      });
    });
  }
};

//获取影厅
exports.getScreen = (req, res, next) => {
  let { cinema_id } = req.body;
  if(!cinema_id){
    res.json({
      code:-1,
      msg:'缺少影院id'
    });
    return;
  }
  screenListTable.find({cinema_id},(err,data)=>{
    if (err) return console.log(err);
    if(data.length == 0){
      res.json({
        code:1,
        msg:'获取成功',
        data
      });
    }else{
      res.json({
        code:0,
        msg:'获取成功',
        data
      });
    }
  });
}