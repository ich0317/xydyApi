const express = require("express");
const app = express();
const filmListTable = require("../../models/film_list");
const sessionListTable = require("../../models/session_list");


//查询影片
exports.searchFilm = (req, res, next) => {
  let { film_name } = req.body;
  if(film_name){
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
  }
};

//设置排期
exports.addSession = (req, res, next) => {
  
  let { _id } = req.body;
  if(_id){
    //修改
  }else{
    //新增
    sessionListTable.create(req.body,(err,data)=>{
      if (err) return console.log(err);
      res.json({
        code:0,
        msg:'添加成功',
        data
      });
    });
  }
}

//获取排期
exports.getSession = (req, res, next) => {
  let { cinema_id } = req.body;
  
  sessionListTable.find(req.body,(err,data)=>{
    if (err) return console.log(err);
    if(data.length == 0){
      res.json({
        code:1,
        msg:'暂无排期',
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