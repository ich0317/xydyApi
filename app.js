require('./config');
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

  let flag = null;
  if(process.env.NODE_ENV == 'development'){
    flag =`${process.env.BASE_URL}:9528`;
  }
  if(process.env.NODE_ENV == 'production'){
    flag =`${process.env.BASE_URL}/admin`;
  }

    //需要登录权限
    if (req.headers.host.indexOf(flag) == -1) {

      //前台
      if(needLogin){  //是否需要权限验证
        if (!!getToken) {

          //有token
          jwt.verify(getToken, 'b1234',async function (err, decoded) {

            if (decoded) {
              let hasUser = await userListTable.findById({_id:decoded.user_id});
              if(hasUser){
                next();
              } else{
                res.json({
                  code: 20003,
                  msg: '账户不存在'
                });
              }
            } else {

              res.json({
                code: 20003,
                msg: '登录已过期'
              });
              
            }
            
          });
        } else {
          if (getClientRouter.indexOf('/api/userLogin') != -1) {
            next()
          } else {
            res.json({
              code: 20003,
              msg: '请先登录'
            });
          }
        }
      }else{
        next();
      }
    } else {

      //后台
      if (!!getToken) {
        jwt.verify(getToken, 'a1234', function (err, decoded) {
       
          if (decoded) {
            next();
          } else {
            res.json({
              code: 20003,
              'msg': '登录已过期'
            });
          }
        });
      } else {
        next();
      }
    }

})

app.use('/api', routerApi);
mongoose.connect(`mongodb://${process.env.IP}:27017/xydy`, {
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

app.listen(process.env.PORT); //创建端口

//删除no do
