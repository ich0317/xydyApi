const express = require("express");
const app = express();
const filmListTable = require("../../models/film_list");


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
