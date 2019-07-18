const express = require("express");
const app = express();
const bodyParser = require("body-parser"); //交互
const mongoose = require("mongoose"); //数据库
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
    if (req.headers.referer.indexOf('localhost:8082') != -1) {

      //前台
      if(needLogin){  //是否需要权限验证
        if (!!getToken) {

          //有token
          jwt.verify(getToken, 'b1234', function (err, decoded) {

            if (decoded) {
              global.piaoUserId = decoded.user_id;
              next();
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

mongoose.connect("mongodb://localhost:27017/xydy", {
  useNewUrlParser: true
});
app.listen("8084"); //创建端口
//删除no do