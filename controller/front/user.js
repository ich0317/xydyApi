const userListTable = require("../../models/user");
let jwt = require('jsonwebtoken');

//登录
exports.userLogin = async (req, res, next) => {
  let { username, password } = req.body;
  userListTable.findOne({ username, password }, (err, data) => {
    if (data) {
      let content = { username: data.username, user_id: data._id };
      let token = jwt.sign(content, "b1234", { expiresIn: 60 * 600 });  //秒
      res.json({
        code: 0,
        msg: '登录成功',
        data: {
          token,
          username:data.username
        }
      });
    } else {
      res.json({
        code: -1,
        msg: '用户名密码不正确',
        data
      });
    }

  });
}

//注册
exports.userReg = async (req, res, next) => {
  let { username, password, configPassword } = req.body;
  const findUser = await userListTable.findOne({username});
  if(findUser){
    res.json({
      code:-1,
      msg:'用户名已存在'
    });
  }else{
    userListTable.create({username,password},(err,data)=>{
      res.json({
        code:0,
        msg:'注册成功'
      });
    })
  }
}