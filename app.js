const express = require("express");
const app = express();
const bodyParser = require("body-parser"); //交互
const mongoose = require("mongoose"); //数据库
const collegeListTable = require("./models/college_list"); //数据表
const filmListTable = require("./models/film_list");
const cinemaListTable = require("./models/cinema_list");
const screenListTable = require("./models/screen_list");
const sessionListTable = require("./models/session_list");
const adminUserTable = require("./models/admin_user");
let jwt = require('jsonwebtoken');
let routerApi = require("./routes/api");
   
app.use(
  bodyParser.urlencoded({
    limit: "50mb",
    extended: true
  })
);

app.use(
  bodyParser.json({
    limit: "50mb"
  })
);


app.use('/uploads', express.static(__dirname + "/uploads")); //文件托管

//登录拦截
app.all('/*', function(req, res, next){
  let getToken = req.headers['x-token'];

  if(!!getToken){
    jwt.verify(getToken, 'a1234', function(err, decoded) {
      
      if(decoded){
        next();
      }else{
        res.json({
          code:20003,
          'msg':'登录已过期'
        });
      }
    });
  }else{
    console.log(2222);
    next();
  }
})

app.use('/', routerApi);
 
mongoose.connect("mongodb://localhost:27017/xydy", {
  useNewUrlParser: true
});
app.listen("8084"); //创建端口
//删除no do
