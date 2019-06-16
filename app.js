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
let jwt = require("jsonwebtoken");
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

app.use('/', routerApi);
 
mongoose.connect("mongodb://localhost:27017/xydy", {
  useNewUrlParser: true
});
app.listen("8084"); //创建端口
//删除no do
