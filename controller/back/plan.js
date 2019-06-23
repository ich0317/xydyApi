const express = require("express");
const app = express();
const filmListTable = require("../../models/film_list");
const sessionListTable = require("../../models/session_list");
const screenListTable = require("../../models/screen_list");


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
  console.log(req.body);
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

//获取影厅和排期
exports.getScreenSession = async (req, res, next) => {
  let { cinema_id, start_datetime } = req.query;
  console.log(cinema_id);
  const screenRes = await screenListTable.find({cinema_id},(err,data)=>{
    if (err) return console.log(err);
    return data;
  })

  if(screenRes.length == 0){
    res.json({
      code:1,
      msg:'暂无影厅',
      data:{
        screen:screenRes,
        session:[]
      }
    });
    return;
  }

  sessionListTable.find({$and:[
    {cinema_id},
    {start_datetime:{$gte:`${start_datetime} 00:00`}},
    {start_datetime:{$lte:`${start_datetime} 23:59`}}
  ]},(err,data)=>{
    if (err) return console.log(err);
    if(data.length == 0){
      res.json({
        code:1,
        msg:'暂无排期',
        data:{
          screen:screenRes,
          session:[]
        }
      });
    }else{
      res.json({
        code:0,
        msg:'获取成功',
        data:{
          screen:screenRes,
          session:data
        }
      });
    }
  });
}

//删除排期
exports.delSession = (req, res, next) => {
  sessionListTable.deleteOne(req.body,(err,data)=>{
    if (err) return console.log(err);
      res.json({
        code:0,
        msg:'删除成功',
        data
      });
  });
}

//审核排期
exports.agreeSession = (req, res, next) => {
  
  sessionListTable.updateMany({_id:req.body},{status:1}, (err,data)=>{
    if (err) return console.log(err);
      res.json({
        code:0,
        msg:'审核成功'
      });
  });
}