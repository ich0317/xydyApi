const express = require("express");
const app = express();
const bodyParser = require("body-parser"); //交互
const mongoose = require("mongoose"); //数据库
const session = require('express-session')
const userListTable = require("./models/user");
let jwt = require('jsonwebtoken');
let routerApi = require("./routes/api");
let { parseToken } = require("./utils/token");

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

// app.use(session({
//   secret: 'keyboard cat',
//   resave: true,
//   name:'pos_coor_id',
//   saveUninitialized: true,
//   cookie: { maxAge :1000000 }
// }))

app.use('/uploads', express.static(__dirname + "/uploads")); //文件托管

//登录拦截
app.all('/*', function(req, res, next){

  let getToken = req.headers['x-token'];
  let getClientRouter = req.url;  //获取客户端访问路由

  let getMethod = {
    GET:function(){
      return req.query;
    },
    POST:function(){
      return req.body;
    }
  };
  let { needLogin } = getMethod[req.method](req);

    //需要登录权限
 
})

app.use('/api', routerApi);

mongoose.connect("mongodb://148.70.228.18:22:27017/xydy", {
  useNewUrlParser: true
});

// const orderListTable = require("./models/order_list");
// const server = require("http").Server(app);
// const io = require("socket.io")(server);

// io.on("connection", function(socket) {
//   socket.emit("unpay", { hello: "world2" });
//   socket.on("token", function(data) {
//     let { user_id } = parseToken(data.token, "b1234");
//     orderListTable.find({user_id,status:0},(err,data)=>{
//       console.log(data);
//     })
//   });
// });

app.listen("8084"); //创建端口
//删除no do
